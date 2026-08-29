"use client";

import type { ReactNode } from "react";

import { useLocale } from "@/lib/i18n/locale-context";

import styles from "./external-citation-link.module.css";

export interface ExternalCitationLinkProps {
  href: string;
  children: ReactNode;
  showBadge?: boolean;
  className?: string;
}

export function ExternalCitationLink({
  href,
  children,
  showBadge = true,
  className,
}: ExternalCitationLinkProps) {
  const { locale } = useLocale();

  const titleText =
    locale === "hi"
      ? "बाहरी आधिकारिक संदर्भ (गैर-संबद्ध सरकारी पोर्टल)"
      : "External official reference (Non-affiliated portal)";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={titleText}
      aria-label={`${children} (${locale === "hi" ? "बाहरी आधिकारिक लिंक, नई विंडो में खुलता है" : "External official link, opens in new tab"})`}
      className={`${styles.link} ${className || ""}`}
    >
      <span>{children}</span>
      <span className={styles.icon} aria-hidden="true">
        ↗
      </span>
      {showBadge ? (
        <span className={styles.badge}>
          {locale === "hi" ? "आधिकारिक संदर्भ" : "Official Source"}
        </span>
      ) : null}
    </a>
  );
}
