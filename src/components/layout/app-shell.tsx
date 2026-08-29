import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./app-shell.module.css";

type AppShellProps = Readonly<{
  children: ReactNode;
  currentStep?: number;
}>;

export function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>

      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link className={styles.brand} href="/" aria-label="ClaimSaathi home">
            <span className={styles.brandMark} aria-hidden="true">
              <span />
              <span />
            </span>
            <span className={styles.brandCopy}>
              <strong>ClaimSaathi</strong>
              <small>PF guidance, made human</small>
            </span>
          </Link>

          <nav className={styles.nav} aria-label="Primary navigation">
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/#safety">Safety</Link>
            <Link className={styles.navCta} href="/demo">
              Open demo <span aria-hidden="true">↗</span>
            </Link>
          </nav>
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
            <strong>ClaimSaathi</strong>
            <p>A clearer route through a fictional EPF withdrawal journey.</p>
          </div>
          <div className={styles.footerNote}>
            <span className={styles.prototypeDot} aria-hidden="true" />
            Independent prototype · No live government connection
          </div>
          <div className={styles.footerMeta}>
            <span>Built for the OpenAI Buildathon</span>
            <span>© 2026 ClaimSaathi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
