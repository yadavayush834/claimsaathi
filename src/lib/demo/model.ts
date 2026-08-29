export const DEMO_DATA_VERSION = 1 as const;

export const DEMO_PERSONA_IDS = [
  "asha-planning",
  "imran-returned",
  "latha-settlement",
] as const;

export type DemoPersonaId = (typeof DEMO_PERSONA_IDS)[number];
export type DemoClaimStatus = "draft" | "action_needed" | "settled";
export type DemoClaimKind = "pf_advance";
export type DemoIssueTone = "clear" | "attention" | "review";
export type DemoPreflightCategory = "identity" | "bank" | "evidence";
export type DemoPreflightStatus = "ready" | "action_needed";

export type DemoPersona = Readonly<{
  id: DemoPersonaId;
  displayName: string;
  homeState: string;
  scenarioTitle: string;
  scenarioDescription: string;
  claimId: string;
  synthetic: true;
}>;

export type DemoClaim = Readonly<{
  id: string;
  personaId: DemoPersonaId;
  kind: DemoClaimKind;
  requestedAmountRupees: number;
  status: DemoClaimStatus;
  lastEventLabel: string;
  synthetic: true;
}>;

export type DemoDataset = Readonly<{
  version: typeof DEMO_DATA_VERSION;
  personas: readonly DemoPersona[];
  claims: readonly DemoClaim[];
}>;

export type DemoCase = Readonly<{
  fixtureVersion: typeof DEMO_DATA_VERSION;
  persona: DemoPersona;
  claim: DemoClaim;
  workspace: DemoWorkspaceSnapshot;
}>;

export type DemoBalance = Readonly<{
  employeeShareRupees: number;
  employerShareRupees: number;
  pensionShareRupees: number;
}>;

export type DemoClaimEvent = Readonly<{
  id: string;
  occurredOn: string;
  title: string;
  description: string;
}>;

export type DemoIssue = Readonly<{
  tone: DemoIssueTone;
  title: string;
  description: string;
  ownerLabel: string;
}>;

export type DemoNextAction = Readonly<{
  title: string;
  description: string;
}>;

export type DemoPreflightCheck = Readonly<{
  id: string;
  category: DemoPreflightCategory;
  label: string;
  status: DemoPreflightStatus;
  summary: string;
  comparedRecords: readonly Readonly<{
    label: string;
    value: string;
  }>[];
  ownerLabel: string;
  actionLabel: string;
  correctionSteps: readonly string[];
}>;

export type DemoPreflightSnapshot = Readonly<{
  checks: readonly DemoPreflightCheck[];
}>;

export type DemoWorkspaceSnapshot = Readonly<{
  personaId: DemoPersonaId;
  balance: DemoBalance;
  recentEvents: readonly DemoClaimEvent[];
  issue: DemoIssue;
  nextAction: DemoNextAction;
  preflight: DemoPreflightSnapshot;
}>;

export type DemoWorkspaceDataset = Readonly<{
  version: typeof DEMO_DATA_VERSION;
  workspaces: readonly DemoWorkspaceSnapshot[];
}>;

export type DemoSession = Readonly<{
  version: typeof DEMO_DATA_VERSION;
  personaId: DemoPersonaId;
}>;

export type MockClaimFormStep = 1 | 2 | 3 | 4;

export type MockClaimDraft = Readonly<{
  version: typeof DEMO_DATA_VERSION;
  personaId: DemoPersonaId;
  step: MockClaimFormStep;
  treatmentNeed: string;
  fictionalCity: string;
  notificationRoute: "browser" | "mock_sms" | "mock_email";
  bankConfirmed: boolean;
  declarationConfirmed: boolean;
  consentConfirmed?: boolean;
  simulatedOtp?: string;
}>;

export type MockClaimSubmissionRequest = Readonly<{
  personaId: DemoPersonaId;
  treatmentNeed: string;
  fictionalCity: string;
  notificationRoute: "browser" | "mock_sms" | "mock_email";
  bankConfirmed: boolean;
  declarationConfirmed: boolean;
  consentConfirmed: boolean;
  simulatedOtp: string;
  requestedAmountRupees?: number;
}>;

export type MockClaimSubmissionReceipt = Readonly<{
  acknowledgementNumber: string;
  claimReference: string;
  submittedAt: string;
  personaId: DemoPersonaId;
  requestedAmountRupees: number;
  notificationRoute: "browser" | "mock_sms" | "mock_email";
  estimatedWorkingDays: number;
  synthetic: true;
}>;

export type MockClaimSubmissionResult =
  | Readonly<{
      ok: true;
      receipt: MockClaimSubmissionReceipt;
    }>
  | Readonly<{
      ok: false;
      error: string;
      field?:
        "simulatedOtp" | "consentConfirmed" | "treatmentNeed" | "fictionalCity";
    }>;

export function isDemoPersonaId(value: unknown): value is DemoPersonaId {
  return (
    typeof value === "string" &&
    DEMO_PERSONA_IDS.some((personaId) => personaId === value)
  );
}
