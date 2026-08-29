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
      preflight: {
        checks: [
          {
            id: "asha-identity",
            category: "identity",
            label: "Member identity",
            status: "ready",
            summary: "The fictional name and date of birth agree in this demo.",
            comparedRecords: [
              { label: "Member record", value: "Asha Verma · 11 Feb 1993" },
              { label: "Identity record", value: "Asha Verma · 11 Feb 1993" },
            ],
            ownerLabel: "No action needed",
            actionLabel: "Identity ready",
            correctionSteps: [],
          },
          {
            id: "asha-bank",
            category: "bank",
            label: "Bank account details",
            status: "ready",
            summary:
              "The fictional bank account name agrees with the member record.",
            comparedRecords: [
              { label: "Member record", value: "Asha Verma" },
              { label: "Bank record", value: "Asha Verma" },
            ],
            ownerLabel: "No action needed",
            actionLabel: "Bank details ready",
            correctionSteps: [],
          },
          {
            id: "asha-evidence",
            category: "evidence",
            label: "Supporting evidence",
            status: "ready",
            summary:
              "The fictional case file includes the supporting note used in this demo.",
            comparedRecords: [
              { label: "Case need", value: "Medical treatment" },
              { label: "Evidence file", value: "Mock treatment note attached" },
            ],
            ownerLabel: "No action needed",
            actionLabel: "Evidence ready",
            correctionSteps: [],
          },
        ],
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
        title: "Run the fictional readiness preflight",
        description:
          "Check the demo identity, bank, and evidence records before continuing.",
      },
      preflight: {
        checks: [
          {
            id: "imran-identity",
            category: "identity",
            label: "Date of birth on record",
            status: "action_needed",
            summary:
              "The fictional member and identity records show different dates of birth.",
            comparedRecords: [
              { label: "Member record", value: "17 Jun 1994" },
              { label: "Identity record", value: "17 Jun 1995" },
            ],
            ownerLabel: "Citizen and employer record",
            actionLabel: "Confirm the correct fictional date of birth",
            correctionSteps: [
              "Compare the two fictional dates before choosing one.",
              "Ask the fictional employer record to use the confirmed date.",
              "Return here and mark this demo check ready.",
            ],
          },
          {
            id: "imran-bank",
            category: "bank",
            label: "Name on bank account",
            status: "action_needed",
            summary:
              "The fictional bank account uses an abbreviated name that differs from the member record.",
            comparedRecords: [
              { label: "Member record", value: "Imran Sheikh" },
              { label: "Bank record", value: "Imran S. Sheikh" },
            ],
            ownerLabel: "Citizen and bank record",
            actionLabel: "Align the fictional bank account name",
            correctionSteps: [
              "Use the fictional member name as the comparison point.",
              "Ask the fictional bank record to expand the abbreviated name.",
              "Return here and mark this demo check ready.",
            ],
          },
          {
            id: "imran-evidence",
            category: "evidence",
            label: "Medical treatment note",
            status: "action_needed",
            summary:
              "The fictional case describes treatment but has no supporting note attached.",
            comparedRecords: [
              { label: "Case need", value: "Medical treatment" },
              { label: "Evidence file", value: "No fictional note attached" },
            ],
            ownerLabel: "Citizen",
            actionLabel: "Add a fictional treatment note",
            correctionSteps: [
              "Check that the fictional note names the treatment need.",
              "Attach the fictional note to this demo case file.",
              "Return here and mark this demo check ready.",
            ],
          },
        ],
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
      preflight: {
        checks: [
          {
            id: "latha-identity",
            category: "identity",
            label: "Member identity",
            status: "ready",
            summary: "The fictional name and date of birth agree in this demo.",
            comparedRecords: [
              { label: "Member record", value: "Latha Nair · 23 Oct 1988" },
              { label: "Identity record", value: "Latha Nair · 23 Oct 1988" },
            ],
            ownerLabel: "No action needed",
            actionLabel: "Identity ready",
            correctionSteps: [],
          },
          {
            id: "latha-bank",
            category: "bank",
            label: "Bank account details",
            status: "ready",
            summary:
              "The fictional bank account name agrees with the member record.",
            comparedRecords: [
              { label: "Member record", value: "Latha Nair" },
              { label: "Bank record", value: "Latha Nair" },
            ],
            ownerLabel: "No action needed",
            actionLabel: "Bank details ready",
            correctionSteps: [],
          },
          {
            id: "latha-evidence",
            category: "evidence",
            label: "Supporting evidence",
            status: "ready",
            summary:
              "The fictional settlement case includes its comparison statement.",
            comparedRecords: [
              { label: "Case issue", value: "Settlement difference" },
              {
                label: "Evidence file",
                value: "Mock settlement statement attached",
              },
            ],
            ownerLabel: "No action needed",
            actionLabel: "Evidence ready",
            correctionSteps: [],
          },
        ],
      },
    },
  ],
} as const satisfies DemoWorkspaceDataset;
