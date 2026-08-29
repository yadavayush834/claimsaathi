import {
  isDemoPersonaId,
  type MockClaimSubmissionReceipt,
  type MockClaimSubmissionRequest,
  type MockClaimSubmissionResult,
} from "@/lib/demo/model";

export const DEFAULT_SIMULATED_OTP = "123456";

const claimReferencesByPersona: Record<string, string> = {
  "asha-planning": "DEMO-CLM-1001",
  "imran-returned": "DEMO-CLM-1002",
  "latha-settlement": "DEMO-CLM-1003",
};

const personaInitials: Record<string, string> = {
  "asha-planning": "AV",
  "imran-returned": "IS",
  "latha-settlement": "LN",
};

function generateAckNumber(personaId: string): string {
  const initials = personaInitials[personaId] ?? "CS";
  return `ACK-2026-${initials}-9482`;
}

export function submitMockClaim(
  payload: unknown,
  options?: { now?: () => string },
): MockClaimSubmissionResult {
  if (!payload || typeof payload !== "object") {
    return {
      ok: false,
      error: "Invalid request payload format.",
    };
  }

  const candidate = payload as Partial<MockClaimSubmissionRequest>;

  if (!isDemoPersonaId(candidate.personaId)) {
    return {
      ok: false,
      error: "Invalid or missing fictional persona identifier.",
    };
  }

  if (
    typeof candidate.treatmentNeed !== "string" ||
    !candidate.treatmentNeed.trim()
  ) {
    return {
      ok: false,
      field: "treatmentNeed",
      error: "Describe the fictional treatment or need before submitting.",
    };
  }

  if (
    typeof candidate.fictionalCity !== "string" ||
    !candidate.fictionalCity.trim()
  ) {
    return {
      ok: false,
      field: "fictionalCity",
      error: "Enter a fictional city before submitting.",
    };
  }

  if (!candidate.bankConfirmed) {
    return {
      ok: false,
      error: "Please confirm the fictional bank record before submitting.",
    };
  }

  if (!candidate.declarationConfirmed) {
    return {
      ok: false,
      error: "Please confirm the fictional declaration before submitting.",
    };
  }

  if (!candidate.consentConfirmed) {
    return {
      ok: false,
      field: "consentConfirmed",
      error: "Consent is required to simulate this mock claim submission.",
    };
  }

  if (
    typeof candidate.simulatedOtp !== "string" ||
    !/^\d{6}$/.test(candidate.simulatedOtp.trim())
  ) {
    return {
      ok: false,
      field: "simulatedOtp",
      error: "Enter a 6-digit simulated OTP code (use 123456 for the demo).",
    };
  }

  if (candidate.simulatedOtp.trim() !== DEFAULT_SIMULATED_OTP) {
    return {
      ok: false,
      field: "simulatedOtp",
      error: `Invalid simulated OTP. For this demo, please use code ${DEFAULT_SIMULATED_OTP}.`,
    };
  }

  const notificationRoute =
    candidate.notificationRoute === "mock_sms" ||
    candidate.notificationRoute === "mock_email"
      ? candidate.notificationRoute
      : "browser";

  const getIsoDate = options?.now ?? (() => new Date().toISOString());

  const receipt: MockClaimSubmissionReceipt = {
    acknowledgementNumber: generateAckNumber(candidate.personaId),
    claimReference:
      claimReferencesByPersona[candidate.personaId] ?? "DEMO-CLM-1001",
    submittedAt: getIsoDate(),
    personaId: candidate.personaId,
    requestedAmountRupees:
      typeof candidate.requestedAmountRupees === "number" &&
      candidate.requestedAmountRupees > 0
        ? candidate.requestedAmountRupees
        : 75000,
    notificationRoute,
    estimatedWorkingDays: 3,
    synthetic: true,
  };

  return {
    ok: true,
    receipt,
  };
}
