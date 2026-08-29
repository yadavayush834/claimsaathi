"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { type SupportedLocale, defaultLocaleStore } from "./locale-store";
import { translations, type TranslationDictionary } from "./translations";

export const LOW_BANDWIDTH_STORAGE_KEY = "claimsaathi.demo.low_bandwidth.v1";

interface LocaleContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: TranslationDictionary;
  isLowBandwidth: boolean;
  setLowBandwidth: (val: boolean) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale = "en",
}: {
  children: ReactNode;
  initialLocale?: SupportedLocale;
}) {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    if (typeof window !== "undefined") {
      return defaultLocaleStore.getLocale();
    }
    return initialLocale;
  });

  const [isLowBandwidth, setLowBandwidthState] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        return (
          window.localStorage.getItem(LOW_BANDWIDTH_STORAGE_KEY) === "true"
        );
      } catch {
        return false;
      }
    }
    return false;
  });

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    defaultLocaleStore.setLocale(newLocale);
  };

  const setLowBandwidth = (enabled: boolean) => {
    setLowBandwidthState(enabled);
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.setItem(
          LOW_BANDWIDTH_STORAGE_KEY,
          enabled ? "true" : "false",
        );
      } catch {
        // Ignore storage error
      }
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      if (locale === "hi") {
        document.documentElement.setAttribute("data-lang", "hi");
      } else {
        document.documentElement.removeAttribute("data-lang");
      }
    }
  }, [locale]);

  const value: LocaleContextValue = {
    locale,
    setLocale,
    t: translations[locale],
    isLowBandwidth,
    setLowBandwidth,
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: "en",
      setLocale: () => {},
      t: translations.en,
      isLowBandwidth: false,
      setLowBandwidth: () => {},
    };
  }
  return ctx;
}
