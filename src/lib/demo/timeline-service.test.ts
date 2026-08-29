import { beforeEach, describe, expect, it } from "vitest";

import type { MockClaimSubmissionReceipt } from "./model";
import {
  advanceClaimStatus,
  getBaselineTimeline,
  getTimelineForPersona,
  getTimelineMilestones,
  recordClaimSubmission,
  resetTimeline,
} from "./timeline-service";

describe("timeline-service", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("loads baseline timeline correctly for personas", () => {
    const asha = getBaselineTimeline("asha-planning");
    expect(asha.status).toBe("draft");
    expect(asha.requestedAmountRupees).toBe(75000);
    expect(asha.events.length).toBeGreaterThan(0);

    const imran = getBaselineTimeline("imran-returned");
    expect(imran.status).toBe("action_needed");

    const latha = getBaselineTimeline("latha-settlement");
    expect(latha.status).toBe("settled");
  });

  it("records claim submission, transitioning to submitted status with receipt details", () => {
    const receipt: MockClaimSubmissionReceipt = {
      acknowledgementNumber: "ACK-2026-AV-9482",
      claimReference: "DEMO-CLM-1001",
      submittedAt: "2026-08-29T12:00:00.000Z",
      personaId: "asha-planning",
      requestedAmountRupees: 75000,
      notificationRoute: "browser",
      estimatedWorkingDays: 3,
      synthetic: true,
    };

    const recorded = recordClaimSubmission(receipt);
    expect(recorded.status).toBe("submitted");
    expect(recorded.acknowledgementNumber).toBe("ACK-2026-AV-9482");
    expect(recorded.events[0].title).toBe("Mock claim submitted in demo");

    const reloaded = getTimelineForPersona("asha-planning");
    expect(reloaded.status).toBe("submitted");
    expect(reloaded.acknowledgementNumber).toBe("ACK-2026-AV-9482");
  });

  it("advances claim through lifecycle states deterministically", () => {
    const fixedNow = () => "2026-08-29T14:00:00.000Z";

    // 1. draft -> submitted
    const step1 = advanceClaimStatus("asha-planning", undefined, {
      now: fixedNow,
    });
    expect(step1.status).toBe("submitted");

    // 2. submitted -> under_process
    const step2 = advanceClaimStatus("asha-planning", undefined, {
      now: fixedNow,
    });
    expect(step2.status).toBe("under_process");
    expect(step2.events[0].title).toContain("Under field office review");

    // 3. under_process -> approved
    const step3 = advanceClaimStatus("asha-planning", undefined, {
      now: fixedNow,
    });
    expect(step3.status).toBe("approved");
    expect(step3.events[0].title).toContain("Sanction order approved");

    // 4. approved -> settled
    const step4 = advanceClaimStatus("asha-planning", undefined, {
      now: fixedNow,
    });
    expect(step4.status).toBe("settled");
    expect(step4.events[0].title).toContain("Settlement completed");
  });

  it("resets timeline back to baseline", () => {
    advanceClaimStatus("asha-planning");
    expect(getTimelineForPersona("asha-planning").status).toBe("submitted");

    const reset = resetTimeline("asha-planning");
    expect(reset.status).toBe("draft");
    expect(getTimelineForPersona("asha-planning").status).toBe("draft");
  });

  it("computes milestone stepper states accurately", () => {
    const baseline = getBaselineTimeline("asha-planning");
    const milestones = getTimelineMilestones(baseline);
    expect(milestones).toHaveLength(4);
    expect(milestones[0].label).toContain("Submission");
    expect(milestones[0].state).toBe("current");

    const settled = getBaselineTimeline("latha-settlement");
    const settledMilestones = getTimelineMilestones(settled);
    expect(settledMilestones.every((m) => m.state === "completed")).toBe(true);
  });
});
