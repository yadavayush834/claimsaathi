import type { DemoPersonaId } from "./model";
import {
  RECOVERY_VERSION,
  type RecoveryStepId,
  type RejectionRecoveryPlan,
  type RejectionRecoveryStep,
} from "./recovery-model";
import { createRecoveryStore } from "./recovery-store";
import { recordClaimSubmission } from "./timeline-service";

function getStorage(): Storage | undefined {
  if (typeof window === "undefined") return undefined;
  return window.localStorage;
}

const IMRAN_DEFAULT_STEPS: readonly RejectionRecoveryStep[] = [
  {
    id: "verify-bank-passbook",
    title: "Verify full name on bank passbook",
    description:
      "Confirm the exact printed name spelling (including initials) on your bank passbook matches your EPFO UAN profile.",
    owner: "Citizen",
    completed: false,
    officialCitation: "EPFO Circular No. WSU/2022/Bank-KYC/12",
  },
  {
    id: "upload-bank-kyc",
    title: "Upload corrected bank proof on Member Portal",
    description:
      "Submit the updated bank account details with a scanned cheque or passbook copy on the EPFO Unified Member Portal.",
    owner: "Citizen",
    completed: false,
    officialCitation: "EPF Scheme 1952 Para 72(5)",
  },
  {
    id: "employer-dsc-approval",
    title: "Employer digital signature approval",
    description:
      "Establishment HR/employer verifies and digitally approves the newly seeded bank KYC using their DSC token.",
    owner: "Employer",
    completed: false,
    officialCitation: "EPFO Unified Portal Employer SOP",
  },
  {
    id: "preflight-clearance",
    title: "Verify readiness preflight checks",
    description:
      "Confirm that synthetic Identity, Bank, and Evidence checks all show green with zero blockers.",
    owner: "Citizen",
    completed: false,
    officialCitation: "ClaimSaathi Preflight SOP",
  },
];

export function buildBaselineRecoveryPlan(
  personaId: DemoPersonaId,
): RejectionRecoveryPlan {
  return {
    version: RECOVERY_VERSION,
    personaId,
    rejectionReason:
      "Fictional bank name does not match member record. Re-upload bank proof before resubmission.",
    category: "bank_error",
    categoryLabel: "Bank Account Name Mismatch",
    plainLanguageExplanation:
      "Your previous claim was halted because the name on your bank record differed from your EPFO profile. After updating your bank KYC and employer approval, you can safely resubmit.",
    steps: IMRAN_DEFAULT_STEPS,
    preflightPassed: false,
    resubmitted: false,
    lastUpdated: new Date().toISOString(),
    synthetic: true,
  };
}

export const recoveryService = {
  getRecoveryPlan(personaId: DemoPersonaId): RejectionRecoveryPlan {
    const store = createRecoveryStore(getStorage());
    const existing = store.load(personaId);
    if (existing) return existing;

    const baseline = buildBaselineRecoveryPlan(personaId);
    store.save(baseline);
    return baseline;
  },

  toggleRecoveryStep(
    personaId: DemoPersonaId,
    stepId: RecoveryStepId,
    completed: boolean,
  ): RejectionRecoveryPlan {
    const current = this.getRecoveryPlan(personaId);
    const updatedSteps = current.steps.map((s) =>
      s.id === stepId ? { ...s, completed } : s,
    );

    const allStepsCompleted = updatedSteps.every((s) => s.completed);

    const updated: RejectionRecoveryPlan = {
      ...current,
      steps: updatedSteps,
      preflightPassed: allStepsCompleted ? true : current.preflightPassed,
      lastUpdated: new Date().toISOString(),
    };

    const store = createRecoveryStore(getStorage());
    store.save(updated);
    return updated;
  },

  markAllRecoveryStepsComplete(
    personaId: DemoPersonaId,
  ): RejectionRecoveryPlan {
    const current = this.getRecoveryPlan(personaId);
    const updatedSteps = current.steps.map((s) => ({
      ...s,
      completed: true,
    }));

    const updated: RejectionRecoveryPlan = {
      ...current,
      steps: updatedSteps,
      preflightPassed: true,
      lastUpdated: new Date().toISOString(),
    };

    const store = createRecoveryStore(getStorage());
    store.save(updated);
    return updated;
  },

  markPreflightPassed(
    personaId: DemoPersonaId,
    passed: boolean,
  ): RejectionRecoveryPlan {
    const current = this.getRecoveryPlan(personaId);
    const updatedSteps = current.steps.map((s) =>
      s.id === "preflight-clearance" ? { ...s, completed: passed } : s,
    );

    const updated: RejectionRecoveryPlan = {
      ...current,
      steps: updatedSteps,
      preflightPassed: passed,
      lastUpdated: new Date().toISOString(),
    };

    const store = createRecoveryStore(getStorage());
    store.save(updated);
    return updated;
  },

  recordRecoveryResubmission(
    personaId: DemoPersonaId,
    newClaimId: string,
  ): RejectionRecoveryPlan {
    const current = this.getRecoveryPlan(personaId);
    const updated: RejectionRecoveryPlan = {
      ...current,
      resubmitted: true,
      resubmittedClaimId: newClaimId,
      lastUpdated: new Date().toISOString(),
    };

    const store = createRecoveryStore(getStorage());
    store.save(updated);

    // Also advance the timeline for this persona to submitted state
    try {
      recordClaimSubmission({
        personaId,
        claimReference: newClaimId,
        acknowledgementNumber: `ACK-2026-REC-${Math.floor(1000 + Math.random() * 9000)}`,
        submittedAt: new Date().toISOString(),
        requestedAmountRupees: 75000,
        estimatedWorkingDays: 7,
        notificationRoute: "browser",
        synthetic: true,
      });
    } catch {
      // Non-blocking timeline recording
    }

    return updated;
  },

  resetRecoveryPlan(personaId: DemoPersonaId): RejectionRecoveryPlan {
    const store = createRecoveryStore(getStorage());
    store.clear(personaId);
    return this.getRecoveryPlan(personaId);
  },
};
