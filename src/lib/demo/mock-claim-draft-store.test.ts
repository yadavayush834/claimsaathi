import { beforeEach, describe, expect, it } from "vitest";

import { DEMO_DATA_VERSION, type MockClaimDraft } from "@/lib/demo/model";

import {
  createMockClaimDraftStore,
  MOCK_CLAIM_DRAFT_STORAGE_KEY,
} from "./mock-claim-draft-store";

const draft: MockClaimDraft = {
  version: DEMO_DATA_VERSION,
  personaId: "asha-planning",
  step: 2,
  treatmentNeed: "Fictional planned treatment",
  fictionalCity: "Faridabad",
  notificationRoute: "browser",
  bankConfirmed: true,
  declarationConfirmed: false,
};

describe("MockClaimDraftStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves and restores one fictional claim draft", () => {
    const store = createMockClaimDraftStore(window.localStorage);

    expect(store.save(draft)).toBe(true);
    expect(store.load("asha-planning")).toEqual(draft);
  });

  it("does not restore another fictional citizen's draft", () => {
    const store = createMockClaimDraftStore(window.localStorage);

    store.save(draft);

    expect(store.load("imran-returned")).toBeNull();
  });

  it("does not load incompatible draft data", () => {
    const store = createMockClaimDraftStore(window.localStorage);
    window.localStorage.setItem(
      MOCK_CLAIM_DRAFT_STORAGE_KEY,
      JSON.stringify({ ...draft, step: 5 }),
    );

    expect(store.load("asha-planning")).toBeNull();
  });
});
