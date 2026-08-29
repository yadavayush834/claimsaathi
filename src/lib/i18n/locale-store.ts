export type SupportedLocale = "en" | "hi";

export const LOCALE_STORAGE_KEY = "claimsaathi.demo.locale.v1";

export interface LocaleStore {
  getLocale(): SupportedLocale;
  setLocale(locale: SupportedLocale): void;
}

export function createLocaleStore(storage?: Storage): LocaleStore {
  const getStorage = (): Storage | null => {
    if (storage) return storage;
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage;
    }
    return null;
  };

  return {
    getLocale(): SupportedLocale {
      const s = getStorage();
      if (!s) return "en";
      try {
        const raw = s.getItem(LOCALE_STORAGE_KEY);
        if (raw === "hi" || raw === "en") {
          return raw;
        }
      } catch {
        // Fallback to default
      }
      return "en";
    },

    setLocale(locale: SupportedLocale): void {
      const s = getStorage();
      if (!s) return;
      try {
        s.setItem(LOCALE_STORAGE_KEY, locale);
      } catch {
        // Ignore storage errors in restricted contexts
      }
    },
  };
}

export const defaultLocaleStore = createLocaleStore();
