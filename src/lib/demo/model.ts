export const DEMO_DATA_VERSION = 1 as const;

export const DEMO_PERSONA_IDS = [
  "asha-planning",
  "imran-returned",
  "latha-settlement",
  "rohit-medical",
  "meera-childcare",
  "vikram-renovation",
  "priya-wedding",
  "arjun-education",
  "sunita-parentcare",
  "karthik-business",
  "neha-emergency",
  "deepak-housing",
  "aarav-travel",
  "pooja-medical",
  "suresh-debt",
  "kavita-ceremony",
  "mohit-training",
  "ananya-relocation",
  "ramesh-medical",
  "divya-parentcare",
] as const;

export type DemoPersonaId = (typeof DEMO_PERSONA_IDS)[number];
export type DemoClaimStatus = "draft" | "action_needed" | "settled";
export type DemoClaimKind = "pf_advance";
export type DemoIssueTone = "clear" | "attention" | "review";

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

export type DemoWorkspaceSnapshot = Readonly<{
  personaId: DemoPersonaId;
  balance: DemoBalance;
  recentEvents: readonly DemoClaimEvent[];
  issue: DemoIssue;
  nextAction: DemoNextAction;
}>;

export type DemoWorkspaceDataset = Readonly<{
  version: typeof DEMO_DATA_VERSION;
  workspaces: readonly DemoWorkspaceSnapshot[];
}>;

export type DemoSession = Readonly<{
  version: typeof DEMO_DATA_VERSION;
  personaId: DemoPersonaId;
}>;

export function isDemoPersonaId(value: unknown): value is DemoPersonaId {
  return (
    typeof value === "string" &&
    DEMO_PERSONA_IDS.some((personaId) => personaId === value)
  );
}
