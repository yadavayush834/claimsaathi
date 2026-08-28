export const DEMO_DATA_VERSION = 1 as const;

export const DEMO_PERSONA_IDS = [
  "asha-planning",
  "imran-returned",
  "latha-settlement",
] as const;

export type DemoPersonaId = (typeof DEMO_PERSONA_IDS)[number];
export type DemoClaimStatus = "draft" | "action_needed" | "settled";
export type DemoClaimKind = "pf_advance";

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
