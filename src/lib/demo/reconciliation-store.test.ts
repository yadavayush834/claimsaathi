import { beforeEach, describe, expect, it } from "vitest";

import {
  RECONCILIATION_STORAGE_KEY_PREFIX,
  type SettlementReconciliationReport,
} from "./reconciliation-model";
import { createReconciliationStore } from "./reconciliation-store";

describe("SettlementReconciliationStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const mockReport: SettlementReconciliationReport = {
    version: 1,
    personaId: "latha-settlement",
    claimId: "DEMO-CLM-1003",
    claimType: "Form 31 (PF Advance - House Construction)",
    requestedAmountRupees: 110000,
    eligibleAmountRupees: 92000,
    settledAmountRupees: 92000,
    varianceRupees: 18000,
    disbursementDate: "2026-08-27",
    disbursedBankMasked: "SBI •••• 5129",
    confirmedFacts: [
      {
        id: "f-1",
        label: "Requested Amount",
        value: "₹1,10,000",
        source: "Member Application",
        verified: true,
      },
    ],
    deductionsAndFactors: [
      {
        id: "d-1",
        title: "Statutory Scheme Limit Cap",
        amountRupees: 18000,
        ruleCitation: "EPF Scheme 1952 Para 68B(2)",
        type: "statutory_cap",
        isExplained: true,
        explanation: "Advance capped at 24 months basic wages & DA ceiling.",
      },
    ],
    unexplainedShortfallRupees: 0,
    resolutionStatus: "under_review",
    updatedAt: "2026-08-28T10:00:00.000Z",
  };

  it("saves, loads, and clears a valid reconciliation report", () => {
    const store = createReconciliationStore(window.localStorage);

    expect(store.load("latha-settlement")).toBeNull();

    const saved = store.save(mockReport);
    expect(saved).toBe(true);

    const loaded = store.load("latha-settlement");
    expect(loaded).toEqual(mockReport);

    store.clear("latha-settlement");
    expect(store.load("latha-settlement")).toBeNull();
  });

  it("handles corrupted or invalid stored JSON safely", () => {
    const store = createReconciliationStore(window.localStorage);
    window.localStorage.setItem(
      `${RECONCILIATION_STORAGE_KEY_PREFIX}:latha-settlement`,
      "{ invalid json",
    );

    expect(store.load("latha-settlement")).toBeNull();

    window.localStorage.setItem(
      `${RECONCILIATION_STORAGE_KEY_PREFIX}:latha-settlement`,
      JSON.stringify({ version: 99, personaId: "latha-settlement" }),
    );

    expect(store.load("latha-settlement")).toBeNull();
  });
});
