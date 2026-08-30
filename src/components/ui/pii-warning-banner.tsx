"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import { type PiiDetectionResult } from "@/lib/safety/pii-detector";

import styles from "./pii-warning-banner.module.css";

export interface PiiWarningBannerProps {
  detection: PiiDetectionResult;
  className?: string;
}

export function PiiWarningBanner({
  detection,
  className,
}: PiiWarningBannerProps) {
  const { locale } = useLocale();

  if (!detection.hasPii) {
    return null;
  }

  const message =
    locale === "hi" && detection.warningHi
      ? detection.warningHi
      : detection.warningEn ||
        "⚠️ Privacy Warning: Please do not enter real Aadhaar, PAN, UAN, bank details or passwords.";

  return (
    <aside
      className={`${styles.banner} ${className || ""}`}
      role="alert"
      aria-live="polite"
    >
      <span className={styles.icon} aria-hidden="true">
        🛡️
      </span>
      <div className={styles.content}>
        <span className={styles.title}>
          {locale === "hi"
            ? "गोपनीयता सुरक्षा अलर्ट"
            : "Privacy & Safety Notice"}
        </span>
        <span>{message}</span>
      </div>
    </aside>
  );
}
