import { DEMO_DATA_VERSION, type DemoDataset } from "@/lib/demo/model";

export const DEMO_DATA_V1 = {
  version: DEMO_DATA_VERSION,
  personas: [
    {
      id: "asha-planning",
      displayName: "Asha Verma",
      homeState: "Haryana",
      scenarioTitle: "Planning a first withdrawal",
      scenarioDescription:
        "Asha wants to understand the path and check readiness before starting.",
      claimId: "DEMO-CLM-1001",
      synthetic: true,
    },
    {
      id: "imran-returned",
      displayName: "Imran Sheikh",
      homeState: "Maharashtra",
      scenarioTitle: "Claim returned for correction",
      scenarioDescription:
        "Imran needs a clear recovery path after a fictional bank-name mismatch.",
      claimId: "DEMO-CLM-1002",
      synthetic: true,
    },
    {
      id: "latha-settlement",
      displayName: "Latha Nair",
      homeState: "Kerala",
      scenarioTitle: "Settlement amount needs explanation",
      scenarioDescription:
        "Latha wants to understand why a fictional settlement is lower than requested.",
      claimId: "DEMO-CLM-1003",
      synthetic: true,
    },
  ],
  claims: [
    {
      id: "DEMO-CLM-1001",
      personaId: "asha-planning",
      kind: "pf_advance",
      requestedAmountRupees: 75000,
      status: "draft",
      lastEventLabel: "Demo case prepared",
      synthetic: true,
    },
    {
      id: "DEMO-CLM-1002",
      personaId: "imran-returned",
      kind: "pf_advance",
      requestedAmountRupees: 42000,
      status: "action_needed",
      lastEventLabel: "Correction requested in simulation",
      synthetic: true,
    },
    {
      id: "DEMO-CLM-1003",
      personaId: "latha-settlement",
      kind: "pf_advance",
      requestedAmountRupees: 110000,
      status: "settled",
      lastEventLabel: "Mock settlement recorded",
      synthetic: true,
    },
  ],
} as const satisfies DemoDataset;
