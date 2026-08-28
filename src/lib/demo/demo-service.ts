import { DEMO_DATA_V1 } from "@/lib/demo/fixtures/v1";
import type { DemoCase, DemoDataset, DemoPersonaId } from "@/lib/demo/model";

export interface DemoDataService {
  readonly fixtureVersion: DemoDataset["version"];
  listCases(): readonly DemoCase[];
  loadCase(personaId: string): DemoCase | null;
}

export function createDemoDataService(
  dataset: DemoDataset = DEMO_DATA_V1,
): DemoDataService {
  const claimsById = new Map(dataset.claims.map((claim) => [claim.id, claim]));
  const cases = dataset.personas.map((persona) => {
    const claim = claimsById.get(persona.claimId);

    if (!claim || claim.personaId !== persona.id) {
      throw new Error(`Missing synthetic claim for persona: ${persona.id}`);
    }

    return Object.freeze({
      fixtureVersion: dataset.version,
      persona,
      claim,
    });
  });
  const casesByPersonaId = new Map<DemoPersonaId, DemoCase>(
    cases.map((demoCase) => [demoCase.persona.id, demoCase]),
  );

  return Object.freeze({
    fixtureVersion: dataset.version,
    listCases: () => cases,
    loadCase: (personaId: string) =>
      casesByPersonaId.get(personaId as DemoPersonaId) ?? null,
  });
}

export const demoDataService = createDemoDataService();
