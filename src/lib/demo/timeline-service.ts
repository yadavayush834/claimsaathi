import { demoDataService } from "@/lib/demo/demo-service";
import {
  DEMO_DATA_VERSION,
  type DemoClaimEvent,
  type DemoClaimStatus,
  type DemoClaimTimelineRecord,
  type DemoNextAction,
  type DemoPersonaId,
  type DemoTimelineMilestone,
  type MockClaimSubmissionReceipt,
} from "@/lib/demo/model";
import { createTimelineStore } from "@/lib/demo/timeline-store";

type SessionStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function getStorage(storage?: SessionStorage): SessionStorage | null {
  if (storage) return storage;
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }
  return null;
}

export function getBaselineTimeline(
  personaId: DemoPersonaId,
): DemoClaimTimelineRecord {
  const demoCase = demoDataService.loadCase(personaId);
  if (!demoCase) {
    throw new Error(`Unknown demo persona: ${personaId}`);
  }

  const claimStatus: DemoClaimStatus =
    demoCase.claim.status === "action_needed"
      ? "action_needed"
      : demoCase.claim.status === "settled"
        ? "settled"
        : "draft";

  return {
    version: DEMO_DATA_VERSION,
    personaId,
    claimId: demoCase.claim.id,
    acknowledgementNumber:
      personaId === "latha-settlement"
        ? "ACK-2026-LN-3104"
        : personaId === "imran-returned"
          ? "ACK-2026-IS-5521"
          : undefined,
    status: claimStatus,
    requestedAmountRupees: demoCase.claim.requestedAmountRupees,
    events: demoCase.workspace.recentEvents,
    updatedAt: new Date().toISOString(),
    pendingAction: demoCase.workspace.nextAction,
  };
}

export function getTimelineForPersona(
  personaId: DemoPersonaId,
  storage?: SessionStorage,
): DemoClaimTimelineRecord {
  const activeStorage = getStorage(storage);
  if (!activeStorage) {
    return getBaselineTimeline(personaId);
  }

  const store = createTimelineStore(activeStorage);
  const existing = store.load(personaId);
  if (existing) {
    return existing;
  }

  return getBaselineTimeline(personaId);
}

export function recordClaimSubmission(
  receipt: MockClaimSubmissionReceipt,
  storage?: SessionStorage,
): DemoClaimTimelineRecord {
  const activeStorage = getStorage(storage);
  const baseline = getTimelineForPersona(receipt.personaId, storage);

  const submissionEvent: DemoClaimEvent = {
    id: `DEMO-EVT-${Date.now()}`,
    occurredOn: receipt.submittedAt.slice(0, 10),
    title: "Mock claim submitted in demo",
    description: `Synthetic claim received under reference ${receipt.claimReference} (Acknowledgement ${receipt.acknowledgementNumber}). Expected turnaround: ${receipt.estimatedWorkingDays} working days.`,
  };

  const nextAction: DemoNextAction = {
    title: "Field office verification queued",
    description:
      "Your fictional claim packet has been dispatched to Dealing Assistant verification.",
  };

  const updatedRecord: DemoClaimTimelineRecord = {
    version: DEMO_DATA_VERSION,
    personaId: receipt.personaId,
    claimId: receipt.claimReference,
    acknowledgementNumber: receipt.acknowledgementNumber,
    status: "submitted",
    requestedAmountRupees: receipt.requestedAmountRupees,
    events: [submissionEvent, ...baseline.events],
    updatedAt: receipt.submittedAt,
    pendingAction: nextAction,
  };

  if (activeStorage) {
    createTimelineStore(activeStorage).save(updatedRecord);
  }

  return updatedRecord;
}

export function advanceClaimStatus(
  personaId: DemoPersonaId,
  storage?: SessionStorage,
  options?: { now?: () => string },
): DemoClaimTimelineRecord {
  const current = getTimelineForPersona(personaId, storage);
  const now = options?.now ? options.now() : new Date().toISOString();
  const dateStr = now.slice(0, 10);

  let nextStatus: DemoClaimStatus = current.status;
  let newEventTitle = "";
  let newEventDesc = "";
  let nextAction: DemoNextAction = current.pendingAction;

  if (current.status === "draft") {
    nextStatus = "submitted";
    newEventTitle = "Claim submitted in simulation";
    newEventDesc =
      "Mock claim packet submitted with simulated Aadhaar OTP verification.";
    nextAction = {
      title: "Field office allocation",
      description:
        "Your mock claim is queued for dealing assistant allocation.",
    };
  } else if (current.status === "submitted") {
    nextStatus = "under_process";
    newEventTitle = "Under field office review";
    newEventDesc =
      "Assigned to Dealing Assistant (DA). Member KYC, service eligibility, and bank records under scrutiny.";
    nextAction = {
      title: "Section supervisor authorization",
      description:
        "Dealing assistant has verified the mock records and recommended sanction.",
    };
  } else if (current.status === "under_process") {
    nextStatus = "approved";
    newEventTitle = "Sanction order approved";
    newEventDesc = `Assistant PF Commissioner approved sanction order for ₹${current.requestedAmountRupees.toLocaleString("en-IN")}. Scheduled for bank NEFT payment.`;
    nextAction = {
      title: "Payment disbursement",
      description:
        "Payment file sent to RBI NEFT gateway for credit to confirmed bank account.",
    };
  } else if (current.status === "approved") {
    nextStatus = "settled";
    newEventTitle = "Settlement completed";
    newEventDesc = `Payment of ₹${current.requestedAmountRupees.toLocaleString("en-IN")} credited to fictional bank account •••• 8421 via NEFT.`;
    nextAction = {
      title: "Mock claim settled",
      description:
        "Funds credited successfully in this demo. No pending actions.",
    };
  } else if (current.status === "action_needed") {
    nextStatus = "under_process";
    newEventTitle = "Preflight correction re-verified";
    newEventDesc =
      "Synthetic name and bank record discrepancy resolved. Claim returned to active field processing.";
    nextAction = {
      title: "Final supervisor review",
      description:
        "Field office is running the final sanction verification on corrected records.",
    };
  }

  const updatedRecord: DemoClaimTimelineRecord = {
    ...current,
    status: nextStatus,
    updatedAt: now,
    events: [
      {
        id: `DEMO-EVT-${Date.now()}`,
        occurredOn: dateStr,
        title: newEventTitle,
        description: newEventDesc,
      },
      ...current.events,
    ],
    pendingAction: nextAction,
  };

  const activeStorage = getStorage(storage);
  if (activeStorage) {
    createTimelineStore(activeStorage).save(updatedRecord);
  }

  return updatedRecord;
}

export function resetTimeline(
  personaId: DemoPersonaId,
  storage?: SessionStorage,
): DemoClaimTimelineRecord {
  const activeStorage = getStorage(storage);
  if (activeStorage) {
    createTimelineStore(activeStorage).clear(personaId);
  }
  return getBaselineTimeline(personaId);
}

export function getTimelineMilestones(
  timeline: DemoClaimTimelineRecord,
): readonly DemoTimelineMilestone[] {
  const { status } = timeline;

  const isSubmittedDone = status !== "draft";
  const isFieldDone =
    status === "approved" || status === "settled" || status === "under_process";
  const isApprovedDone = status === "approved" || status === "settled";
  const isSettledDone = status === "settled";

  return [
    {
      stage: "submitted",
      label: "1. Submission",
      state: isSubmittedDone
        ? "completed"
        : status === "draft"
          ? "current"
          : "upcoming",
      summary:
        status === "draft"
          ? "Mock claim drafted in this browser"
          : `Claim received (${timeline.acknowledgementNumber ?? "ACK"})`,
    },
    {
      stage: "field_office",
      label: "2. Field review",
      state:
        status === "action_needed"
          ? "current"
          : isFieldDone && status !== "under_process"
            ? "completed"
            : status === "submitted" || status === "under_process"
              ? "current"
              : "upcoming",
      summary:
        status === "action_needed"
          ? "Correction needed on records"
          : status === "under_process"
            ? "Dealing assistant scrutinizing records"
            : isFieldDone
              ? "Field verification passed"
              : "Dealing assistant verification",
    },
    {
      stage: "approval",
      label: "3. Sanction & approval",
      state: isApprovedDone
        ? "completed"
        : status === "under_process"
          ? "current"
          : "upcoming",
      summary: isApprovedDone
        ? `Sanctioned for ₹${timeline.requestedAmountRupees.toLocaleString("en-IN")}`
        : "APFC sanction order issuance",
    },
    {
      stage: "settlement",
      label: "4. Settlement",
      state: isSettledDone
        ? "completed"
        : status === "approved"
          ? "current"
          : "upcoming",
      summary: isSettledDone
        ? "Payment credited to bank account"
        : "RBI NEFT direct bank transfer",
    },
  ];
}
