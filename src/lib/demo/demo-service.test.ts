import { describe, expect, it } from "vitest";

import { createDemoDataService } from "./demo-service";

describe("DemoDataService", () => {
  it("loads versioned personas together with their synthetic claims", () => {
    const service = createDemoDataService();
    const cases = service.listCases();

    expect(service.fixtureVersion).toBe(1);
    expect(cases).toHaveLength(20);
    expect(cases.every((demoCase) => demoCase.persona.synthetic)).toBe(true);
    expect(cases.every((demoCase) => demoCase.claim.synthetic)).toBe(true);
    expect(cases.every((demoCase) => demoCase.fixtureVersion === 1)).toBe(true);
    expect(
      cases.every((demoCase) => demoCase.workspace.recentEvents.length > 0),
    ).toBe(true);
    // Persona IDs and claim IDs should be unique across the dataset.
    const personaIds = new Set(cases.map((c) => c.persona.id));
    const claimIds = new Set(cases.map((c) => c.claim.id));
    expect(personaIds.size).toBe(20);
    expect(claimIds.size).toBe(20);
  });

  it("returns the matching typed case and rejects unknown persona ids", () => {
    const service = createDemoDataService();

    expect(service.loadCase("imran-returned")).toMatchObject({
      persona: { displayName: "Imran Sheikh" },
      claim: { id: "DEMO-CLM-1002", status: "action_needed" },
      workspace: {
        issue: { tone: "attention" },
        nextAction: { title: "Check the fictional bank-name mismatch" },
      },
    });
    // A persona added in the expanded fixture
    expect(service.loadCase("aarav-travel")).toMatchObject({
      persona: { displayName: "Aarav Singh" },
      claim: { id: "DEMO-CLM-1013", status: "settled" },
    });
    expect(service.loadCase("not-a-demo-persona")).toBeNull();
  });
});
