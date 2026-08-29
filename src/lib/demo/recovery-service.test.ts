import { beforeEach, describe, expect, it } from "vitest";

import { recoveryService } from "./recovery-service";

describe("recovery-service", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns baseline recovery plan with 4 structured steps for Imran", () => {
    const plan = recoveryService.getRecoveryPlan("imran-returned");
    expect(plan.steps).toHaveLength(4);
    expect(plan.steps[0].id).toBe("verify-bank-passbook");
    expect(plan.steps[0].owner).toBe("Citizen");
    expect(plan.steps[2].owner).toBe("Employer");
    expect(plan.steps.every((s) => !s.completed)).toBe(true);
    expect(plan.resubmitted).toBe(false);
  });

  it("toggles step completion and checks overall status", () => {
    let plan = recoveryService.toggleRecoveryStep(
      "imran-returned",
      "verify-bank-passbook",
      true,
    );
    expect(plan.steps[0].completed).toBe(true);
    expect(plan.steps[1].completed).toBe(false);

    plan = recoveryService.markAllRecoveryStepsComplete("imran-returned");
    expect(plan.steps.every((s) => s.completed)).toBe(true);
    expect(plan.preflightPassed).toBe(true);
  });

  it("records resubmission and marks plan resubmitted", () => {
    const plan = recoveryService.recordRecoveryResubmission(
      "imran-returned",
      "DEMO-CLM-REC-9001",
    );
    expect(plan.resubmitted).toBe(true);
    expect(plan.resubmittedClaimId).toBe("DEMO-CLM-REC-9001");
  });
});
