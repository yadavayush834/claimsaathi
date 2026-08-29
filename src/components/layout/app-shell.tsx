"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { LocaleProvider, useLocale } from "@/lib/i18n/locale-context";

import styles from "./app-shell.module.css";

type AppShellProps = Readonly<{
  children: ReactNode;
  currentStep?: number;
}>;

function AppShellContent({ children }: AppShellProps) {
  const { t, locale, isLowBandwidth } = useLocale();

  return (
    <div
      className={styles.shell}
      data-lang={locale}
      data-low-bandwidth={isLowBandwidth ? "true" : undefined}
    >
      <a className={styles.skipLink} href="#main-content">
        {t.common.skipToMain}
      </a>

      {isLowBandwidth ? (
        <div
          role="status"
          style={{
            background: "var(--color-warning-soft)",
            borderBottom: "1px solid var(--color-warning-strong)",
            color: "var(--color-warning-strong)",
            padding: "0.35rem 1rem",
            textAlign: "center",
            fontSize: "0.8rem",
            fontWeight: 600,
          }}
        >
          ⚡ {t.common.lowBandwidthOn} · Lightweight mode active
        </div>
      ) : null}

      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link
            className={styles.brand}
            href="/"
            aria-label={`${t.common.brandName} home`}
          >
            <span className={styles.brandMark} aria-hidden="true">
              <span />
              <span />
            </span>
            <span className={styles.brandCopy}>
              <strong>{t.common.brandName}</strong>
              <small>{t.common.brandTagline}</small>
            </span>
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <LanguageSwitcher showBandwidthToggle />

            <nav className={styles.nav} aria-label="Primary navigation">
              <Link href="/#how-it-works">{t.common.howItWorks}</Link>
              <Link href="/#safety">{t.common.safety}</Link>
              <Link className={styles.navCta} href="/demo">
                {t.common.openDemo} <span aria-hidden="true">↗</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className={styles.frame}>
        <main className={styles.main} id="main-content">
          {children}
        </main>
      </div>

      <footer className={styles.siteFooter}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <strong>{t.common.brandName}</strong>
            <p>{t.common.brandTagline}</p>
          </div>
          <div className={styles.footerNote}>
            <span className={styles.prototypeDot} aria-hidden="true" />
            {t.common.prototypeNotice}
          </div>
          <div className={styles.footerMeta}>
            <span>{t.common.buildathonNote}</span>
            <span>{t.common.copyright}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function AppShell({ children, currentStep }: AppShellProps) {
  return (
    <LocaleProvider>
      <AppShellContent currentStep={currentStep}>{children}</AppShellContent>
    </LocaleProvider>
  );
}
