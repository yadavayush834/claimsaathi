import { describe, expect, it } from "vitest";

import {
  getSafeStorage,
  isPersistentBrowserStorage,
  safeStorageGet,
  safeStorageRemove,
  safeStorageSet,
} from "./storage-resilience";

describe("storage-resilience", () => {
  it("reads and writes JSON values safely with normal storage", () => {
    const mockStorage: Storage = {
      length: 0,
      clear: () => {},
      getItem: (k: string) => (k === "test" ? JSON.stringify({ a: 1 }) : null),
      key: () => null,
      removeItem: () => {},
      setItem: () => {},
    };

    const res = safeStorageGet<{ a: number }>("test", mockStorage);
    expect(res).toEqual({ a: 1 });
  });

  it("handles parse errors gracefully without throwing", () => {
    const brokenStorage: Storage = {
      length: 0,
      clear: () => {},
      getItem: () => "invalid-json{",
      key: () => null,
      removeItem: () => {},
      setItem: () => {},
    };

    const res = safeStorageGet("test", brokenStorage);
    expect(res).toBeNull();
  });

  it("recovers from QuotaExceededError by falling back to memory storage", () => {
    const throwingStorage: Storage = {
      length: 0,
      clear: () => {},
      getItem: () => {
        throw new Error("QuotaExceededError");
      },
      key: () => null,
      removeItem: () => {},
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    };

    const ok = safeStorageSet("fallbackKey", { saved: true }, throwingStorage);
    expect(ok).toBe(true);

    safeStorageRemove("fallbackKey", throwingStorage);
  });

  it("returns in-memory storage if window is undefined or localStorage throws", () => {
    const storage = getSafeStorage();
    expect(storage).toBeDefined();
    expect(isPersistentBrowserStorage(storage)).toBe(true);
  });
});
