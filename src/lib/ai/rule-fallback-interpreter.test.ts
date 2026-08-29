import { describe, expect, it } from "vitest";

import { interpretWithRuleFallback } from "./rule-fallback-interpreter";

describe("rule-fallback-interpreter", () => {
  it("interprets bank name mismatch with cited steps", () => {
    const res = interpretWithRuleFallback({
      rawStatusText: "MEMBER NAME IN BANK KYC DOES NOT MATCH WITH UAN RECORD",
    });

    expect(res.category).toBe("bank_error");
    expect(res.severity).toBe("blocker");
    expect(res.confidence).toBe("high");
    expect(res.citedNextSteps.length).toBeGreaterThanOrEqual(2);
    expect(res.citedNextSteps[0].owner).toBe("Citizen");
    expect(res.citedNextSteps[1].owner).toBe("Bank");
    expect(res.isFallback).toBe(true);
  });

  it("interprets date of birth discrepancy requiring Joint Declaration", () => {
    const res = interpretWithRuleFallback({
      rawStatusText:
        "DATE OF BIRTH MISMATCH (>3 YRS DIFFERENCE). SUBMIT JOINT DECLARATION WITH PROOF",
    });

    expect(res.category).toBe("kyc_mismatch");
    expect(res.plainLanguageExplanation).toContain("date of birth recorded");
    expect(res.citedNextSteps[1].officialRuleCitation).toContain(
      "Joint Declaration",
    );
  });

  it("interprets missing medical certificate under Para 68J", () => {
    const res = interpretWithRuleFallback({
      rawStatusText:
        "MEDICAL CERTIFICATE NOT PRODUCED IN PRESCRIBED FORMAT (PARA 68J)",
    });

    expect(res.category).toBe("missing_evidence");
    expect(res.citedNextSteps[0].officialRuleCitation).toContain("Para 68J");
  });

  it("handles unknown custom status text gracefully with keyword analysis", () => {
    const res = interpretWithRuleFallback({
      rawStatusText: "UNKNOWN CUSTOM SYSTEM ERROR - PLEASE RECHECK DETAILS",
    });

    expect(res.category).toBe("unexplained_rejection");
    expect(res.plainLanguageExplanation).toBeDefined();
    expect(res.citedNextSteps.length).toBeGreaterThan(0);
    expect(res.synthetic).toBe(true);
  });
});
