import { beforeEach, describe, expect, it } from "vitest";

import { RECOVERY_STORAGE_KEY, RECOVERY_VERSION } from "./recovery-model";
import { createRecoveryStore } from "./recovery-store";

describe("recovery-store", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns null when no plan is saved", () => {
    const store = createRecoveryStore(window.localStorage);
    expect(store.load("imran-returned")).toBeNull();
  });

  it("saves and loads a valid rejection recovery plan", () => {
    const store = createRecoveryStore(window.localStorage);
    const plan = {
      version: RECOVERY_VERSION,
      personaId: "imran-returned" as const,
      rejectionReason: "Fictional bank name does not match member record.",
      category: "bank_error" as const,
      categoryLabel: "Bank Account Name Mismatch",
      plainLanguageExplanation: "The bank name does not match member record.",
      steps: [
        {
          id: "verify-bank-passbook" as const,
          title: "Verify bank passbook",
          description: "Check exact spelling.",
          owner: "Citizen" as const,
          completed: true,
          officialCitation: "EPFO Circular 2022",
        },
      ],
      preflightPassed: false,
      resubmitted: false,
      lastUpdated: "2026-08-29T12:00:00.000Z",
      synthetic: true as const,
    };

    expect(store.save(plan)).toBe(true);
    const loaded = store.load("imran-returned");
    expect(loaded).not.toBeNull();
    expect(loaded?.personaId).toBe("imran-returned");
    expect(loaded?.steps[0].completed).toBe(true);
  });

  it("clears storage properly", () => {
    const store = createRecoveryStore(window.localStorage);
    window.localStorage.setItem(
      RECOVERY_STORAGE_KEY,
      JSON.stringify({ "imran-returned": { version: 1 } }),
    );

    store.clear("imran-returned");
    expect(store.load("imran-returned")).toBeNull();
  });
});
