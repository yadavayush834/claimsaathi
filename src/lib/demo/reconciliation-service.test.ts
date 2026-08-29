import { beforeEach, describe, expect, it } from "vitest";

import { reconciliationService } from "./reconciliation-service";

describe("reconciliationService", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("builds and loads the baseline reconciliation report for Latha Nair", () => {
    const report =
      reconciliationService.getReconciliationReport("latha-settlement");

    expect(report.personaId).toBe("latha-settlement");
    expect(report.claimId).toBe("DEMO-CLM-1003");
    expect(report.requestedAmountRupees).toBe(110000);
    expect(report.eligibleAmountRupees).toBe(92000);
    expect(report.settledAmountRupees).toBe(92000);
    expect(report.varianceRupees).toBe(18000);
    expect(report.confirmedFacts.length).toBe(5);
    expect(report.deductionsAndFactors.length).toBe(2);
    expect(report.unexplainedShortfallRupees).toBe(0);
    expect(report.resolutionStatus).toBe("under_review");
  });

  it("updates resolution status and persists across reload", () => {
    const updated = reconciliationService.updateResolutionStatus(
      "latha-settlement",
      "accepted_statutory",
    );

    expect(updated.resolutionStatus).toBe("accepted_statutory");

    const reloaded =
      reconciliationService.getReconciliationReport("latha-settlement");
    expect(reloaded.resolutionStatus).toBe("accepted_statutory");
  });

  it("resets reconciliation report cleanly to baseline", () => {
    reconciliationService.updateResolutionStatus(
      "latha-settlement",
      "disputed_for_grievance",
    );

    const reset = reconciliationService.resetReconciliation("latha-settlement");
    expect(reset.resolutionStatus).toBe("under_review");
  });
});
