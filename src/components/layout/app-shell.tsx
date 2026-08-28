import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./app-shell.module.css";

const journeySteps = ["Start", "Prepare", "Review", "Track"] as const;

type AppShellProps = Readonly<{
  children: ReactNode;
  currentStep?: number;
}>;

export function AppShell({ children, currentStep = 1 }: AppShellProps) {
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
        <aside className={styles.rail}>
          <div className={styles.railHeader}>
            <span className={styles.railDot} aria-hidden="true" />
            <p className={styles.railLabel}>YOUR CLAIM ROUTE</p>
          </div>
          <nav aria-label="Claim journey">
            <ol className={styles.steps}>
              {journeySteps.map((step, index) => {
                const stepNumber = index + 1;
                const state =
                  stepNumber < currentStep
                    ? "complete"
                    : stepNumber === currentStep
                      ? "current"
                      : "upcoming";

                return (
                  <li className={styles.step} data-state={state} key={step}>
                    <span className={styles.stepDot} aria-hidden="true">
                      {state === "complete" ? "✓" : `0${stepNumber}`}
                    </span>
                    <span
                      className={styles.stepLabel}
                      aria-current={state === "current" ? "step" : undefined}
                    >
                      {step}
                    </span>
                  </li>
                );
              })}
            </ol>
          </nav>
        </aside>

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
