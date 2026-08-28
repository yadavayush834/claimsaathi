import { describe, expect, it } from "vitest";

import { createDemoDataService } from "./demo-service";

describe("DemoDataService", () => {
  it("loads versioned personas together with their synthetic claims", () => {
    const service = createDemoDataService();
    const cases = service.listCases();

    expect(service.fixtureVersion).toBe(1);
    expect(cases).toHaveLength(3);
    expect(cases.every((demoCase) => demoCase.persona.synthetic)).toBe(true);
    expect(cases.every((demoCase) => demoCase.claim.synthetic)).toBe(true);
    expect(cases.every((demoCase) => demoCase.fixtureVersion === 1)).toBe(true);
  });

  it("returns the matching typed case and rejects unknown persona ids", () => {
    const service = createDemoDataService();

    expect(service.loadCase("imran-returned")).toMatchObject({
      persona: { displayName: "Imran Sheikh" },
      claim: { id: "DEMO-CLM-1002", status: "action_needed" },
    });
    expect(service.loadCase("not-a-demo-persona")).toBeNull();
  });
});
