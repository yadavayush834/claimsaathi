import { describe, expect, it } from "vitest";

import { demoDataService } from "@/lib/demo/demo-service";

import { runDemoPreflight } from "./demo-preflight";

describe("runDemoPreflight", () => {
  it("returns each synthetic readiness issue for Imran's case", () => {
    const demoCase = demoDataService.loadCase("imran-returned");

    expect(demoCase).not.toBeNull();

    const result = runDemoPreflight(demoCase!.workspace.preflight);

    expect(result.readyCount).toBe(0);
    expect(result.actionCount).toBe(3);
    expect(result.categoriesNeedingAction).toEqual([
      "identity",
      "bank",
      "evidence",
    ]);
    expect(result.checks.map((check) => check.ownerLabel)).toEqual([
      "Citizen and employer record",
      "Citizen and bank record",
      "Citizen",
    ]);
  });

  it("keeps a ready fictional case ready", () => {
    const demoCase = demoDataService.loadCase("asha-planning");

    expect(demoCase).not.toBeNull();

    const result = runDemoPreflight(demoCase!.workspace.preflight);

    expect(result.readyCount).toBe(3);
    expect(result.actionCount).toBe(0);
  });
});
