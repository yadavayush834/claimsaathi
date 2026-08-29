import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import styles from "./app-shell.module.css";

type AppShellProps = Readonly<{
  children: ReactNode;
  currentStep?: number; // kept for API compatibility; not rendered
}>;

export function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>

      <header className={styles.topbar}>
        <div>
          <Link className={styles.brand} href="/" aria-label="ClaimSaathi home">
            <span className={styles.brandEn}>Claim</span>
            <span className={styles.brandHi} aria-hidden="false">
              साथी
            </span>
          </Link>
        </div>
        <nav className={styles.topbarActions} aria-label="Primary">
          <Link className={styles.navLink} href="/">
            Overview
          </Link>
          <Link className={styles.navLink} href="/demo">
            Demo
          </Link>
          <ThemeToggle />
        </nav>
      </header>

      <div className={styles.frame}>
        <main className={styles.main} id="main-content">
          {children}
        </main>
      </div>

      <footer className={styles.siteFooter}>
        <div className={styles.footerGrid}>
          <span>
            <span className={styles.footerMark} aria-hidden="true" />
            Independent prototype · not affiliated with EPFO
          </span>
          <span>Synthetic data only</span>
          <span>No live government connection</span>
        </div>
      </footer>
    </div>
  );
}
