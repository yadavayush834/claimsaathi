import Link from "next/link";
import type { ReactNode } from "react";

import { StatusBadge } from "@/components/ui/status-badge";

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
        <Link className={styles.brand} href="/" aria-label="ClaimSaathi home">
          <span className={styles.brandMark} aria-hidden="true">
            CS
          </span>
          <span>
            <strong>ClaimSaathi</strong>
            <small>PF withdrawal companion</small>
          </span>
        </Link>
        <StatusBadge tone="neutral">
          <span className={styles.demoLong}>Independent demo</span>
          <span className={styles.demoShort}>Demo</span>
        </StatusBadge>
      </header>

      <div className={styles.frame}>
        <aside className={styles.rail}>
          <p className={styles.railLabel}>Your claim route</p>
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
                      {stepNumber}
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
    </div>
  );
}
