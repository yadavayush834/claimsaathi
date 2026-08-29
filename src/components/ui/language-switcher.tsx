"use client";

import { useLocale } from "@/lib/i18n/locale-context";

import styles from "./language-switcher.module.css";

export function LanguageSwitcher({
  showBandwidthToggle = false,
}: {
  showBandwidthToggle?: boolean;
}) {
  const { locale, setLocale, t, isLowBandwidth, setLowBandwidth } = useLocale();

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        flexWrap: "wrap",
      }}
    >
      <div
        className={styles.switcher}
        role="group"
        aria-label={t.common.language}
      >
        <button
          type="button"
          className={styles.button}
          data-active={locale === "en"}
          aria-pressed={locale === "en"}
          aria-label={t.common.switchToEnglish}
          onClick={() => setLocale("en")}
        >
          English
        </button>
        <button
          type="button"
          className={styles.button}
          data-active={locale === "hi"}
          aria-pressed={locale === "hi"}
          aria-label={t.common.switchToHindi}
          onClick={() => setLocale("hi")}
        >
          हिन्दी
        </button>
      </div>

      {showBandwidthToggle ? (
        <button
          type="button"
          className={styles.bandwidthToggle}
          data-active={isLowBandwidth}
          aria-pressed={isLowBandwidth}
          title={
            isLowBandwidth ? t.common.lowBandwidthOn : t.common.lowBandwidthOff
          }
          onClick={() => setLowBandwidth(!isLowBandwidth)}
        >
          <span aria-hidden="true">{isLowBandwidth ? "⚡" : "📶"}</span>
          <span>{t.common.lowBandwidth}</span>
        </button>
      ) : null}
    </div>
  );
}
