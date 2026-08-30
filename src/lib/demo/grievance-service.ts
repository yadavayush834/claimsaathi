import { DemoCase } from "./model";
import { DemoPersonaId } from "./model";
import {
  DemoGrievanceRecord,
  GrievanceCategory,
  GrievanceEvidenceItem,
} from "./grievance-model";
import { grievanceStore } from "./grievance-store";

function generateBaselineEvidence(
  personaId: DemoPersonaId,
  claimId: string,
): readonly GrievanceEvidenceItem[] {
  if (personaId === "latha-settlement") {
    return [
      {
        id: "claim-ack",
        title: "Claim Acknowledgement Slip",
        description: `Synthetic Form 31 acknowledgement used only in this demo (Ref: ${claimId}).`,
        required: true,
        attached: true,
        fileName: `Receipt_${claimId}.pdf`,
      },
      {
        id: "bank-credit-advice",
        title: "Bank Credit Statement / Passbook",
        description:
          "Bank statement copy showing disbursed credit of ₹92,000 to SBI account •••• 5129.",
        required: true,
        attached: true,
        fileName: "SBI_Credit_Advice_Aug2026.pdf",
      },
      {
        id: "wage-slip",
        title: "Latest Salary Wage Slip",
        description:
          "Employer salary slip showing monthly Basic wage + DA structure.",
        required: false,
        attached: true,
        fileName: "Salary_Slip_July2026.pdf",
      },
      {
        id: "construction-estimate",
        title: "Housing Estimation / Certificate",
        description:
          "Architectural estimate or municipal approval for house alteration.",
        required: false,
        attached: false,
      },
    ];
  }

  if (personaId === "imran-returned") {
    return [
      {
        id: "claim-ack",
        title: "Claim Acknowledgement Slip",
        description: `Synthetic Form 19 acknowledgement used only in this demo (Ref: ${claimId}).`,
        required: true,
        attached: true,
        fileName: `Receipt_${claimId}.pdf`,
      },
      {
        id: "cancelled-cheque",
        title: "Attested Bank Passbook / Cheque Leaf",
        description:
          "Clear copy with printed name, account number, and IFSC code.",
        required: true,
        attached: true,
        fileName: "Bank_Passbook_Attested.pdf",
      },
      {
        id: "employer-clearance",
        title: "Employer DSC Approval Confirmation",
        description: "Field office digital signature verification slip.",
        required: false,
        attached: true,
        fileName: "DSC_Employer_Confirmation.pdf",
      },
    ];
  }

  return [
    {
      id: "claim-ack",
      title: "Claim Acknowledgement Slip",
      description: `Synthetic acknowledgement used only in this demo (Ref: ${claimId}).`,
      required: true,
      attached: true,
      fileName: `Receipt_${claimId}.pdf`,
    },
    {
      id: "member-id-proof",
      title: "Identity & Bank Proof",
      description: "Aadhaar and bank passbook copies on record.",
      required: true,
      attached: true,
      fileName: "Member_KYC_Pack.pdf",
    },
  ];
}

function buildDefaultPetitionText(demoCase: DemoCase): {
  subject: string;
  text: string;
} {
  const { persona, claim } = demoCase;

  if (persona.id === "latha-settlement") {
    const subject = `Grievance regarding short settlement of Form 31 Housing Advance (Claim ID: ${claim.id})`;
    const text = `[CLAIMSAATHI DEMO DRAFT — FICTIONAL DATA — NOT SUBMITTED]

To,
The Regional P.F. Commissioner,
Employees' Provident Fund Organisation (EPFO),
Regional Office, Kochi / Kerala.

Sub: Representation regarding settlement amount calculation for Form 31 Advance (Claim ID: ${claim.id} / Member: ${persona.displayName})

Respected Sir/Madam,

I, ${persona.displayName}, an active EPF member (Claim ID: ${claim.id}), submitted an online Form 31 claim for House Construction / Alteration advance requesting ₹1,10,000 against my accumulated employee share balance of ₹1,82,500.

The claim was settled and an amount of ₹92,000 was disbursed on 27-Aug-2026. While the calculation appears constrained by the 24-month basic wage ceiling under EPF Scheme 1952 Para 68B(2), I request a formal re-computation verification and a detailed settlement worksheet clarifying the non-refundable advance deduction breakdown.

The supporting documents (Claim Receipt, Bank Credit Advice, Salary Slip) are attached for your reference.

Kindly review the calculation in accordance with EPFO Citizens' Charter standards and provide the breakdown statement.

Thanking you,
Yours faithfully,
${persona.displayName}
Home State: ${persona.homeState}
Date: 2026-08-29`;

    return { subject, text };
  }

  if (persona.id === "imran-returned") {
    const subject = `Grievance regarding rejected claim for bank KYC verification (Claim ID: ${claim.id})`;
    const text = `[CLAIMSAATHI DEMO DRAFT — FICTIONAL DATA — NOT SUBMITTED]

To,
The Regional P.F. Commissioner,
Employees' Provident Fund Organisation (EPFO),
Regional Office, Mumbai / Bandra.

Sub: Representation for expedited re-processing of Form 19 claim (Claim ID: ${claim.id})

Respected Sir/Madam,

I, ${persona.displayName}, had submitted an online claim (Claim ID: ${claim.id}) which was returned with remark "Fictional bank name does not match".

I have re-verified my bank passbook details with clear printed name matching my Aadhaar and UAN records, and my employer has completed digital signature (DSC) approval on the employer portal.

I request you to kindly facilitate the claim re-examination as per the EPFO Citizens' Charter guidelines.

Thanking you,
Yours faithfully,
${persona.displayName}
Home State: ${persona.homeState}
Date: 2026-08-29`;

    return { subject, text };
  }

  const subject = `Grievance regarding status of claim ${claim.id}`;
  const text = `[CLAIMSAATHI DEMO DRAFT — FICTIONAL DATA — NOT SUBMITTED]

To,
The Regional P.F. Commissioner,
Employees' Provident Fund Organisation (EPFO).

Sub: Request for status clarification and resolution of claim ${claim.id}

Respected Sir/Madam,

I, ${persona.displayName}, request a review of my claim ${claim.id} under EPFO Citizens' Charter timelines.

Supporting documents are attached.

Yours faithfully,
${persona.displayName}`;

  return { subject, text };
}

export const grievanceService = {
  getOrInitializeGrievance(demoCase: DemoCase): DemoGrievanceRecord {
    const existing = grievanceStore.load(demoCase.persona.id);
    if (existing) {
      return existing;
    }

    const category: GrievanceCategory =
      demoCase.persona.id === "latha-settlement"
        ? "amount_discrepancy"
        : demoCase.persona.id === "imran-returned"
          ? "unreasonable_rejection"
          : "processing_delay";

    const { subject, text } = buildDefaultPetitionText(demoCase);
    const evidenceList = generateBaselineEvidence(
      demoCase.persona.id,
      demoCase.claim.id,
    );

    const record: DemoGrievanceRecord = {
      schemaVersion: "claimsaathi.grievance.v1",
      personaId: demoCase.persona.id,
      claimId: demoCase.claim.id,
      category,
      subject,
      petitionText: text,
      evidenceList,
      status: "draft",
      slaDaysRemaining: 15,
      reminderActive: false,
      events: [
        {
          id: "evt-initial",
          date: "2026-08-29",
          title: "AI-Assisted Petition Drafted",
          description:
            "A fictional grievance draft was initialized with illustrative scheme references.",
          by: "ClaimSaathi Grievance Assistant",
        },
      ],
    };

    grievanceStore.save(record);
    return record;
  },

  updateSubject(
    personaId: DemoPersonaId,
    newSubject: string,
  ): DemoGrievanceRecord | null {
    const existing = grievanceStore.load(personaId);
    if (!existing) return null;

    const updated: DemoGrievanceRecord = {
      ...existing,
      subject: newSubject,
    };
    grievanceStore.save(updated);
    return updated;
  },

  updatePetitionText(
    personaId: DemoPersonaId,
    newText: string,
  ): DemoGrievanceRecord | null {
    const existing = grievanceStore.load(personaId);
    if (!existing) return null;

    const updated: DemoGrievanceRecord = {
      ...existing,
      petitionText: newText,
    };
    grievanceStore.save(updated);
    return updated;
  },

  toggleEvidenceAttachment(
    personaId: DemoPersonaId,
    evidenceId: string,
  ): DemoGrievanceRecord | null {
    const existing = grievanceStore.load(personaId);
    if (!existing) return null;

    const updatedEvidence = existing.evidenceList.map((item) =>
      item.id === evidenceId ? { ...item, attached: !item.attached } : item,
    );

    const updated: DemoGrievanceRecord = {
      ...existing,
      evidenceList: updatedEvidence,
    };
    grievanceStore.save(updated);
    return updated;
  },

  registerMockGrievance(personaId: DemoPersonaId): DemoGrievanceRecord | null {
    const existing = grievanceStore.load(personaId);
    if (!existing) return null;

    const registrationNumber = `DEMO-EPFIG-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowIso = new Date().toISOString();

    const newEvent = {
      id: `evt-reg-${Date.now()}`,
      date: "2026-08-29",
      title: "Mock grievance registered locally",
      description: `ClaimSaathi generated fictional docket ${registrationNumber}. A demo 15-day follow-up timer was started; nothing was filed with EPFiGMS.`,
      by: "ClaimSaathi local simulator",
    };

    const updated: DemoGrievanceRecord = {
      ...existing,
      status: "registered",
      registrationNumber,
      registeredAt: nowIso,
      slaDaysRemaining: 15,
      reminderActive: true,
      events: [newEvent, ...existing.events],
    };

    grievanceStore.save(updated);
    return updated;
  },

  toggleReminder(personaId: DemoPersonaId): DemoGrievanceRecord | null {
    const existing = grievanceStore.load(personaId);
    if (!existing) return null;

    const updated: DemoGrievanceRecord = {
      ...existing,
      reminderActive: !existing.reminderActive,
    };
    grievanceStore.save(updated);
    return updated;
  },

  resetGrievance(demoCase: DemoCase): DemoGrievanceRecord {
    grievanceStore.clear(demoCase.persona.id);
    return this.getOrInitializeGrievance(demoCase);
  },

  exportPetitionAsText(record: DemoGrievanceRecord): string {
    const attachedNames = record.evidenceList
      .filter((item) => item.attached)
      .map(
        (item, idx) =>
          `  ${idx + 1}. ${item.title} (${item.fileName ?? "Attached"})`,
      )
      .join("\n");

    return `=== CLAIMSAATHI GRIEVANCE PETITION ===
Docket No: ${record.registrationNumber ?? "UNREGISTERED DRAFT"}
Claim Reference: ${record.claimId}
Subject: ${record.subject}
Category: ${record.category.replace(/_/g, " ").toUpperCase()}
Status: ${record.status.toUpperCase()}
Date: 2026-08-29

--- PETITION BODY ---
${record.petitionText}

--- EVIDENCE ATTACHMENTS ---
${attachedNames.length > 0 ? attachedNames : "  No documents attached."}

=======================================
Disclaimer: This is a synthetic grievance simulation generated for educational demonstration under ClaimSaathi.
`;
  },
};
