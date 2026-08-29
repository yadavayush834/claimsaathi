import { beforeEach, describe, expect, it } from "vitest";

import { demoDataService } from "./demo-service";
import { grievanceService } from "./grievance-service";

describe("grievanceService", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("initializes context-aware AI grievance draft for Latha Nair", () => {
    const demoCase = demoDataService.loadCase("latha-settlement");
    expect(demoCase).not.toBeNull();

    const record = grievanceService.getOrInitializeGrievance(demoCase!);
    expect(record.personaId).toBe("latha-settlement");
    expect(record.category).toBe("amount_discrepancy");
    expect(record.subject).toContain("Form 31 Housing Advance");
    expect(record.petitionText).toContain("1,10,000");
    expect(record.petitionText).toContain("92,000");
    expect(record.status).toBe("draft");
    expect(record.evidenceList.length).toBe(4);
    expect(record.evidenceList.filter((e) => e.attached).length).toBe(3);
  });

  it("allows updating petition text and toggling evidence attachments", () => {
    const demoCase = demoDataService.loadCase("latha-settlement");
    grievanceService.getOrInitializeGrievance(demoCase!);

    const updated = grievanceService.updatePetitionText(
      "latha-settlement",
      "Updated custom petition text.",
    );
    expect(updated?.petitionText).toBe("Updated custom petition text.");

    // Toggle construction estimate
    const toggled = grievanceService.toggleEvidenceAttachment(
      "latha-settlement",
      "construction-estimate",
    );
    const estimate = toggled?.evidenceList.find(
      (e) => e.id === "construction-estimate",
    );
    expect(estimate?.attached).toBe(true);
  });

  it("registers mock grievance with simulated EPFiGMS docket and generates export text", () => {
    const demoCase = demoDataService.loadCase("latha-settlement");
    grievanceService.getOrInitializeGrievance(demoCase!);

    const registered =
      grievanceService.registerMockGrievance("latha-settlement");
    expect(registered?.status).toBe("registered");
    expect(registered?.registrationNumber).toMatch(/^DEMO-EPFIG-2026-\d+$/);
    expect(registered?.reminderActive).toBe(true);
    expect(registered?.slaDaysRemaining).toBe(15);
    expect(registered?.events.length).toBeGreaterThanOrEqual(2);

    const exported = grievanceService.exportPetitionAsText(registered!);
    expect(exported).toContain("CLAIMSAATHI GRIEVANCE PETITION");
    expect(exported).toContain(registered?.registrationNumber);
    expect(exported).toContain("EVIDENCE ATTACHMENTS");

    // Toggle reminder
    const toggledReminder = grievanceService.toggleReminder("latha-settlement");
    expect(toggledReminder?.reminderActive).toBe(false);

    // Reset
    const reset = grievanceService.resetGrievance(demoCase!);
    expect(reset.status).toBe("draft");
    expect(reset.registrationNumber).toBeUndefined();
  });
});
