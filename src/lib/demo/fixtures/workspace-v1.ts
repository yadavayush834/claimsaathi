import { DEMO_DATA_VERSION, type DemoWorkspaceDataset } from "@/lib/demo/model";

export const DEMO_WORKSPACES_V1 = {
  version: DEMO_DATA_VERSION,
  workspaces: [
    {
      personaId: "asha-planning",
      balance: {
        employeeShareRupees: 128400,
        employerShareRupees: 48200,
        pensionShareRupees: 31700,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1001-A",
          occurredOn: "2026-08-28",
          title: "Demo case prepared",
          description: "A fictional draft was opened for planning.",
        },
        {
          id: "DEMO-EVT-1001-B",
          occurredOn: "2026-08-27",
          title: "Synthetic balance loaded",
          description: "Fixture v1 supplied the mock balance shown here.",
        },
      ],
      issue: {
        tone: "clear",
        title: "No blocker shown",
        description:
          "This fictional case is ready for withdrawal-goal planning.",
        ownerLabel: "No action owner yet",
      },
      nextAction: {
        title: "Plan the withdrawal",
        description:
          "Choose why Asha needs the funds, then review a mock eligibility result.",
      },
    },
    {
      personaId: "imran-returned",
      balance: {
        employeeShareRupees: 96400,
        employerShareRupees: 36100,
        pensionShareRupees: 24900,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1002-A",
          occurredOn: "2026-08-27",
          title: "Correction requested in simulation",
          description: "The mock claim moved to needs-attention state.",
        },
        {
          id: "DEMO-EVT-1002-B",
          occurredOn: "2026-08-25",
          title: "Mock claim submitted",
          description: "No government system received this submission.",
        },
      ],
      issue: {
        tone: "attention",
        title: "Fictional bank name does not match",
        description:
          "The name in this demo bank record differs from the demo member record.",
        ownerLabel: "Citizen and bank record",
      },
      nextAction: {
        title: "Check the fictional bank-name mismatch",
        description:
          "Review which mock record needs correction and who should update it.",
      },
    },
    {
      personaId: "latha-settlement",
      balance: {
        employeeShareRupees: 182500,
        employerShareRupees: 68400,
        pensionShareRupees: 44600,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1003-A",
          occurredOn: "2026-08-27",
          title: "Mock settlement recorded",
          description: "A fictional payment of ₹92,000 was recorded locally.",
        },
        {
          id: "DEMO-EVT-1003-B",
          occurredOn: "2026-08-26",
          title: "Mock claim approved",
          description: "The simulated review completed without a live request.",
        },
      ],
      issue: {
        tone: "review",
        title: "Settlement is lower than requested",
        description:
          "The mock claim requested ₹1,10,000 and records a ₹92,000 settlement; the difference is not yet explained.",
        ownerLabel: "Needs explanation",
      },
      nextAction: {
        title: "Compare the fictional settlement",
        description:
          "Review requested, eligible, and settled mock amounts side by side.",
      },
    },
  ],
} as const satisfies DemoWorkspaceDataset;
