import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./app-shell.module.css";

type AppShellProps = Readonly<{
  children: ReactNode;
  currentStep?: number; // Kept for API compatibility, unused in minimalist shell
}>;

export function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>

      <header className={styles.topbar}>
        <Link className={styles.brand} href="/" aria-label="ClaimSaathi home">
          CLAIMSAATHI
        </Link>
        <span className={styles.environmentTag}>SIMULATION ENVIRONMENT</span>
      </header>

      <div className={styles.frame}>
        <main className={styles.main} id="main-content">
          {children}
        </main>
      </div>

      <footer className={styles.siteFooter}>
        <div className={styles.footerGrid}>
          <span>(C) 2024</span>
          <span>NO LIVE CONNECTION</span>
          <span className={styles.alignRight}>INDEPENDENT PROTOTYPE</span>
        </div>
      </footer>
    </div>
  );
}
