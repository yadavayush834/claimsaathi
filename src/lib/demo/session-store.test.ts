import { beforeEach, describe, expect, it } from "vitest";

import {
  createDemoSessionStore,
  DEMO_SESSION_STORAGE_KEY,
} from "./session-store";

describe("DemoSessionStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("recovers a selected persona from browser storage", () => {
    const store = createDemoSessionStore(window.localStorage);

    expect(store.save("asha-planning")).toBe(true);
    expect(store.load()).toEqual({ version: 1, personaId: "asha-planning" });
  });

  it("discards corrupt or incompatible session data", () => {
    const store = createDemoSessionStore(window.localStorage);

    window.localStorage.setItem(DEMO_SESSION_STORAGE_KEY, "not-json");
    expect(store.load()).toBeNull();
    expect(window.localStorage.getItem(DEMO_SESSION_STORAGE_KEY)).toBeNull();

    window.localStorage.setItem(
      DEMO_SESSION_STORAGE_KEY,
      JSON.stringify({ version: 2, personaId: "asha-planning" }),
    );
    expect(store.load()).toBeNull();
    expect(window.localStorage.getItem(DEMO_SESSION_STORAGE_KEY)).toBeNull();
  });
});
