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
        <div className={styles.topbarLeft}>
          <Link className={styles.brand} href="/" aria-label="ClaimSaathi home">
            <span className={styles.brandTitle}>CLAIMSAATHI</span>
            <span className={styles.brandSubtitle}>
              PF WITHDRAWAL COMPANION
            </span>
          </Link>
        </div>

        <div className={styles.topbarRight}>
          <div className={styles.independentBadge}>
            <span className={styles.demoLong}>INDEPENDENT DEMO</span>
            <span className={styles.demoShort}>DEMO</span>
          </div>
          <span className={styles.demoTag}>DEMO</span>
          <button
            type="button"
            className={styles.helpButton}
            aria-label="Demo information"
            title="ClaimSaathi simulation environment"
          >
            ?
          </button>
        </div>
      </header>

      <div className={styles.frame}>
        <main className={styles.main} id="main-content">
          {children}
        </main>
      </div>

      <footer className={styles.siteFooter}>
        <div className={styles.footerInner}>
          <p className={styles.footerLeft}>
            CLAIMSAATHI © 2024. FOR SIMULATION ONLY.
          </p>
          <div className={styles.footerLinks}>
            <span>No Login Required</span>
            <span>Synthetic Data</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
