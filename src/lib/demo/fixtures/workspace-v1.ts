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
    {
      personaId: "rohit-medical",
      balance: {
        employeeShareRupees: 74200,
        employerShareRupees: 28100,
        pensionShareRupees: 18600,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1004-A",
          occurredOn: "2026-08-28",
          title: "Fictional draft opened",
          description: "A mock advance case was created for medical planning.",
        },
        {
          id: "DEMO-EVT-1004-B",
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
        title: "Plan the medical advance",
        description:
          "Review a fictional eligibility result for a parent's medical bill.",
      },
    },
    {
      personaId: "meera-childcare",
      balance: {
        employeeShareRupees: 91800,
        employerShareRupees: 34400,
        pensionShareRupees: 22700,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1005-A",
          occurredOn: "2026-08-28",
          title: "Fictional draft opened",
          description:
            "A mock advance case was created for childcare planning.",
        },
        {
          id: "DEMO-EVT-1005-B",
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
        title: "Plan the childcare advance",
        description:
          "Choose the withdrawal amount and review a mock eligibility result.",
      },
    },
    {
      personaId: "vikram-renovation",
      balance: {
        employeeShareRupees: 214300,
        employerShareRupees: 80200,
        pensionShareRupees: 52900,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1006-A",
          occurredOn: "2026-08-27",
          title: "Fictional KYC mismatch noted",
          description:
            "The mock KYC record flags a document difference for review.",
        },
        {
          id: "DEMO-EVT-1006-B",
          occurredOn: "2026-08-25",
          title: "Mock claim submitted",
          description: "No government system received this submission.",
        },
      ],
      issue: {
        tone: "attention",
        title: "Fictional KYC document is stale",
        description:
          "A demo document in this case shows a different address than the member record.",
        ownerLabel: "Citizen and KYC record",
      },
      nextAction: {
        title: "Refresh the fictional KYC document",
        description:
          "Identify the mock document that needs an update and the path to fix it.",
      },
    },
    {
      personaId: "priya-wedding",
      balance: {
        employeeShareRupees: 106800,
        employerShareRupees: 40050,
        pensionShareRupees: 26400,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1007-A",
          occurredOn: "2026-08-28",
          title: "Fictional draft opened",
          description: "A mock advance case was created for wedding planning.",
        },
        {
          id: "DEMO-EVT-1007-B",
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
        title: "Plan the wedding advance",
        description:
          "Review a fictional eligibility result for a small family wedding.",
      },
    },
    {
      personaId: "arjun-education",
      balance: {
        employeeShareRupees: 84200,
        employerShareRupees: 31500,
        pensionShareRupees: 20800,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1008-A",
          occurredOn: "2026-08-28",
          title: "Fictional draft opened",
          description:
            "A mock advance case was created for education planning.",
        },
        {
          id: "DEMO-EVT-1008-B",
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
        title: "Plan the education advance",
        description:
          "Review a fictional eligibility result for postgraduate fees.",
      },
    },
    {
      personaId: "sunita-parentcare",
      balance: {
        employeeShareRupees: 67200,
        employerShareRupees: 25200,
        pensionShareRupees: 16600,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1009-A",
          occurredOn: "2026-08-27",
          title: "Fictional document requested",
          description:
            "The simulated reviewer asked for an additional fictional document.",
        },
        {
          id: "DEMO-EVT-1009-B",
          occurredOn: "2026-08-25",
          title: "Mock claim submitted",
          description: "No government system received this submission.",
        },
      ],
      issue: {
        tone: "attention",
        title: "Fictional prescription record missing",
        description:
          "The demo review needs a fictional prescription reference to continue.",
        ownerLabel: "Citizen and medical record",
      },
      nextAction: {
        title: "Add the fictional prescription reference",
        description:
          "Find the missing mock record and attach it to advance this case.",
      },
    },
    {
      personaId: "karthik-business",
      balance: {
        employeeShareRupees: 256400,
        employerShareRupees: 96100,
        pensionShareRupees: 63300,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1010-A",
          occurredOn: "2026-08-28",
          title: "Fictional draft opened",
          description:
            "A mock advance case was created to explore small-business funding.",
        },
        {
          id: "DEMO-EVT-1010-B",
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
        title: "Plan the small-business advance",
        description:
          "Compare a fictional PF advance against other simulated options.",
      },
    },
    {
      personaId: "neha-emergency",
      balance: {
        employeeShareRupees: 58700,
        employerShareRupees: 22000,
        pensionShareRupees: 14500,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1011-A",
          occurredOn: "2026-08-27",
          title: "Fictional urgency flag set",
          description:
            "The mock case was flagged as urgent to fast-track the simulated review.",
        },
        {
          id: "DEMO-EVT-1011-B",
          occurredOn: "2026-08-25",
          title: "Mock claim submitted",
          description: "No government system received this submission.",
        },
      ],
      issue: {
        tone: "attention",
        title: "Fictional supporting receipt missing",
        description:
          "The demo review needs a fictional receipt to proceed with this case.",
        ownerLabel: "Citizen and household record",
      },
      nextAction: {
        title: "Attach the fictional receipt",
        description:
          "Identify the missing mock receipt and attach it to the case.",
      },
    },
    {
      personaId: "deepak-housing",
      balance: {
        employeeShareRupees: 198700,
        employerShareRupees: 74500,
        pensionShareRupees: 49100,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1012-A",
          occurredOn: "2026-08-28",
          title: "Fictional draft opened",
          description:
            "A mock advance case was created for a housing-loan top-up scenario.",
        },
        {
          id: "DEMO-EVT-1012-B",
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
        title: "Plan the housing top-up",
        description:
          "Review a fictional eligibility result for a housing-loan top-up.",
      },
    },
    {
      personaId: "aarav-travel",
      balance: {
        employeeShareRupees: 119400,
        employerShareRupees: 44750,
        pensionShareRupees: 29500,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1013-A",
          occurredOn: "2026-08-27",
          title: "Fictional settlement recorded",
          description: "A mock settlement of ₹58,000 was recorded locally.",
        },
        {
          id: "DEMO-EVT-1013-B",
          occurredOn: "2026-08-26",
          title: "Mock claim approved",
          description: "The simulated review completed without a live request.",
        },
      ],
      issue: {
        tone: "review",
        title: "Settlement is lower than requested",
        description:
          "The mock claim requested ₹65,000 and records a ₹58,000 settlement; the difference is not yet explained.",
        ownerLabel: "Needs explanation",
      },
      nextAction: {
        title: "Compare the fictional settlement",
        description:
          "Review requested, eligible, and settled mock amounts side by side.",
      },
    },
    {
      personaId: "pooja-medical",
      balance: {
        employeeShareRupees: 89600,
        employerShareRupees: 33600,
        pensionShareRupees: 22100,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1014-A",
          occurredOn: "2026-08-27",
          title: "Fictional document requested",
          description:
            "The simulated reviewer asked for an additional fictional document.",
        },
        {
          id: "DEMO-EVT-1014-B",
          occurredOn: "2026-08-25",
          title: "Mock claim submitted",
          description: "No government system received this submission.",
        },
      ],
      issue: {
        tone: "attention",
        title: "Fictional discharge summary missing",
        description:
          "The demo review needs a fictional discharge summary to continue.",
        ownerLabel: "Citizen and hospital record",
      },
      nextAction: {
        title: "Add the fictional discharge summary",
        description:
          "Find the missing mock document and attach it to advance this case.",
      },
    },
    {
      personaId: "suresh-debt",
      balance: {
        employeeShareRupees: 132800,
        employerShareRupees: 49800,
        pensionShareRupees: 32700,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1015-A",
          occurredOn: "2026-08-28",
          title: "Fictional draft opened",
          description:
            "A mock advance case was created to explore debt consolidation.",
        },
        {
          id: "DEMO-EVT-1015-B",
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
        title: "Plan the debt consolidation advance",
        description:
          "Compare a fictional PF advance against other simulated options.",
      },
    },
    {
      personaId: "kavita-ceremony",
      balance: {
        employeeShareRupees: 76800,
        employerShareRupees: 28800,
        pensionShareRupees: 19000,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1016-A",
          occurredOn: "2026-08-28",
          title: "Fictional draft opened",
          description:
            "A mock advance case was created for a family-ceremony scenario.",
        },
        {
          id: "DEMO-EVT-1016-B",
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
        title: "Plan the ceremony advance",
        description:
          "Review a fictional eligibility result for a family ceremony.",
      },
    },
    {
      personaId: "mohit-training",
      balance: {
        employeeShareRupees: 51400,
        employerShareRupees: 19200,
        pensionShareRupees: 12700,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1017-A",
          occurredOn: "2026-08-27",
          title: "Fictional KYC mismatch noted",
          description:
            "The mock KYC record flags a document difference for review.",
        },
        {
          id: "DEMO-EVT-1017-B",
          occurredOn: "2026-08-25",
          title: "Mock claim submitted",
          description: "No government system received this submission.",
        },
      ],
      issue: {
        tone: "attention",
        title: "Fictional ID document is outdated",
        description:
          "The demo ID record shows an older address than the current member record.",
        ownerLabel: "Citizen and ID record",
      },
      nextAction: {
        title: "Refresh the fictional ID document",
        description:
          "Identify the mock ID that needs an update and the path to fix it.",
      },
    },
    {
      personaId: "ananya-relocation",
      balance: {
        employeeShareRupees: 112600,
        employerShareRupees: 42200,
        pensionShareRupees: 27800,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1018-A",
          occurredOn: "2026-08-28",
          title: "Fictional draft opened",
          description:
            "A mock advance case was created for relocation planning.",
        },
        {
          id: "DEMO-EVT-1018-B",
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
        title: "Plan the relocation advance",
        description:
          "Review a fictional eligibility result for a city-to-city move.",
      },
    },
    {
      personaId: "ramesh-medical",
      balance: {
        employeeShareRupees: 168400,
        employerShareRupees: 63100,
        pensionShareRupees: 41500,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1019-A",
          occurredOn: "2026-08-27",
          title: "Fictional settlement recorded",
          description: "A mock settlement of ₹1,02,000 was recorded locally.",
        },
        {
          id: "DEMO-EVT-1019-B",
          occurredOn: "2026-08-26",
          title: "Mock claim approved",
          description: "The simulated review completed without a live request.",
        },
      ],
      issue: {
        tone: "review",
        title: "Settlement is lower than requested",
        description:
          "The mock claim requested ₹1,25,000 and records a ₹1,02,000 settlement; the difference is not yet explained.",
        ownerLabel: "Needs explanation",
      },
      nextAction: {
        title: "Compare the fictional settlement",
        description:
          "Review requested, eligible, and settled mock amounts side by side.",
      },
    },
    {
      personaId: "divya-parentcare",
      balance: {
        employeeShareRupees: 142900,
        employerShareRupees: 53600,
        pensionShareRupees: 35200,
      },
      recentEvents: [
        {
          id: "DEMO-EVT-1020-A",
          occurredOn: "2026-08-27",
          title: "Fictional settlement recorded",
          description: "A mock settlement of ₹84,000 was recorded locally.",
        },
        {
          id: "DEMO-EVT-1020-B",
          occurredOn: "2026-08-26",
          title: "Mock claim approved",
          description: "The simulated review completed without a live request.",
        },
      ],
      issue: {
        tone: "review",
        title: "Settlement is lower than requested",
        description:
          "The mock claim requested ₹1,00,000 and records a ₹84,000 settlement; the difference is not yet explained.",
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
