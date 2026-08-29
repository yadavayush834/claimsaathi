import { describe, expect, it } from "vitest";

import {
  DEFAULT_SIMULATED_OTP,
  submitMockClaim,
} from "./mock-claim-submission-service";
import type { MockClaimSubmissionRequest } from "./model";

const validRequest: MockClaimSubmissionRequest = {
  personaId: "asha-planning",
  treatmentNeed: "Fictional outpatient treatment",
  fictionalCity: "Faridabad",
  notificationRoute: "browser",
  bankConfirmed: true,
  declarationConfirmed: true,
  consentConfirmed: true,
  simulatedOtp: DEFAULT_SIMULATED_OTP,
  requestedAmountRupees: 75000,
};

describe("submitMockClaim", () => {
  it("successfully validates and produces a synthetic receipt", () => {
    const fixedTime = "2026-08-29T12:00:00.000Z";
    const result = submitMockClaim(validRequest, { now: () => fixedTime });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.receipt).toEqual({
        acknowledgementNumber: "ACK-2026-AV-9482",
        claimReference: "DEMO-CLM-1001",
        submittedAt: fixedTime,
        personaId: "asha-planning",
        requestedAmountRupees: 75000,
        notificationRoute: "browser",
        estimatedWorkingDays: 3,
        synthetic: true,
      });
    }
  });

  it("fails when consent is missing", () => {
    const result = submitMockClaim({
      ...validRequest,
      consentConfirmed: false,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.field).toBe("consentConfirmed");
      expect(result.error).toContain("Consent is required");
    }
  });

  it("fails when OTP is wrong code", () => {
    const result = submitMockClaim({
      ...validRequest,
      simulatedOtp: "999999",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.field).toBe("simulatedOtp");
      expect(result.error).toContain(DEFAULT_SIMULATED_OTP);
    }
  });

  it("fails when OTP format is invalid", () => {
    const result = submitMockClaim({
      ...validRequest,
      simulatedOtp: "123",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.field).toBe("simulatedOtp");
    }
  });

  it("fails when required need or city is empty", () => {
    const result = submitMockClaim({
      ...validRequest,
      treatmentNeed: "",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.field).toBe("treatmentNeed");
    }
  });
});
