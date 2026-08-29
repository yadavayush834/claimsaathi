import { beforeEach, describe, expect, it } from "vitest";

import { DemoGrievanceRecord } from "./grievance-model";
import { grievanceStore } from "./grievance-store";

describe("grievanceStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const sampleRecord: DemoGrievanceRecord = {
    schemaVersion: "claimsaathi.grievance.v1",
    personaId: "latha-settlement",
    claimId: "DEMO-CLM-1003",
    category: "amount_discrepancy",
    subject: "Grievance regarding short settlement of Form 31 advance claim",
    petitionText:
      "Respected Regional P.F. Commissioner,\n\nI am writing to bring to your kind attention a discrepancy...",
    evidenceList: [
      {
        id: "bank-passbook",
        title: "Bank Statement / Credit Advice",
        description: "Showing credit of ₹92,000 against ₹1,10,000 requested.",
        required: true,
        attached: true,
        fileName: "SBI_Credit_Advice_Aug2026.pdf",
      },
    ],
    status: "draft",
    slaDaysRemaining: 15,
    reminderActive: false,
    events: [
      {
        id: "evt-1",
        date: "2026-08-29",
        title: "Draft Created",
        description: "AI-assisted petition draft created from claim records.",
        by: "ClaimSaathi Grievance Assistant",
      },
    ],
  };

  it("returns null when no record is stored or data is invalid", () => {
    expect(grievanceStore.load("latha-settlement")).toBeNull();

    window.localStorage.setItem(
      "claimsaathi.demo.grievance.v1.latha-settlement",
      "invalid-json",
    );
    expect(grievanceStore.load("latha-settlement")).toBeNull();
  });

  it("saves and loads a valid grievance record", () => {
    grievanceStore.save(sampleRecord);
    const loaded = grievanceStore.load("latha-settlement");
    expect(loaded).toEqual(sampleRecord);

    grievanceStore.clear("latha-settlement");
    expect(grievanceStore.load("latha-settlement")).toBeNull();
  });
});
