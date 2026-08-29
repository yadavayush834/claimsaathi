import { beforeEach, describe, expect, it } from "vitest";

import { LOCALE_STORAGE_KEY, createLocaleStore } from "./locale-store";

describe("locale-store", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to English when storage is empty", () => {
    const store = createLocaleStore();
    expect(store.getLocale()).toBe("en");
  });

  it("persists and reads Hindi locale", () => {
    const store = createLocaleStore();
    store.setLocale("hi");
    expect(store.getLocale()).toBe("hi");
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("hi");
  });

  it("safely handles invalid storage values", () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, "invalid-locale");
    const store = createLocaleStore();
    expect(store.getLocale()).toBe("en");
  });
});
