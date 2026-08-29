import { describe, expect, it } from "vitest";

import { calculateMockEligibility } from "./calculator";

const baseInput = {
  purpose: "medical" as const,
  totalServiceMonths: 36,
  previousWithdrawals: 0,
  amountNeededRupees: 75000,
  employeeShareRupees: 128400,
  employerShareRupees: 48200,
  pensionShareRupees: 31700,
};

describe("calculateMockEligibility", () => {
  it("returns an explainable amount while protecting 25 percent", () => {
    const result = calculateMockEligibility(baseInput);

    expect(result.eligible).toBe(true);
    expect(result.amounts).toEqual({
      contributionBalanceRupees: 176600,
      pensionExcludedRupees: 31700,
      protectedBalanceRupees: 44150,
      policyMaximumRupees: 132450,
      amountNeededRupees: 75000,
      eligibleAmountRupees: 75000,
      contributionBalanceAfterRupees: 101600,
    });
    expect(result.checks.every((check) => check.passed)).toBe(true);
  });

  it("caps the result at the mock policy maximum", () => {
    const result = calculateMockEligibility({
      ...baseInput,
      amountNeededRupees: 200000,
    });

    expect(result.eligible).toBe(true);
    expect(result.amounts.eligibleAmountRupees).toBe(132450);
    expect(result.limitingRule).toContain("capped");
  });

  it("returns zero when minimum service is not met", () => {
    const result = calculateMockEligibility({
      ...baseInput,
      totalServiceMonths: 11,
    });

    expect(result.eligible).toBe(false);
    expect(result.amounts.eligibleAmountRupees).toBe(0);
    expect(result.checks.find((check) => check.id === "service")?.passed).toBe(
      false,
    );
  });

  it("returns zero when the purpose frequency is exhausted", () => {
    const result = calculateMockEligibility({
      ...baseInput,
      previousWithdrawals: 3,
    });

    expect(result.eligible).toBe(false);
    expect(result.amounts.eligibleAmountRupees).toBe(0);
    expect(
      result.checks.find((check) => check.id === "frequency")?.passed,
    ).toBe(false);
  });
});
