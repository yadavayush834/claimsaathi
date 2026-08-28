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
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.brandIcon}
            >
              <path
                d="M12 2L4 5V11.5C4 16.5 7.4 21.1 12 22.5C16.6 21.1 20 16.5 20 11.5V5L12 2Z"
                fill="currentColor"
                fillOpacity="0.15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 12L11 14L15 9.5"
                stroke="#ff8c1a"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className={styles.brandText}>
            <strong>ClaimSaathi</strong>
            <small>PF withdrawal companion</small>
          </span>
        </Link>
        <div className={styles.topbarRight}>
          <StatusBadge tone="neutral">
            <span className={styles.demoLong}>Independent demo</span>
            <span className={styles.demoShort}>Demo</span>
          </StatusBadge>
        </div>
      </header>

      <div className={styles.frame}>
        <aside className={styles.rail}>
          <div className={styles.railHeader}>
            <span className={styles.railDot} aria-hidden="true" />
            <p className={styles.railLabel}>Your claim route</p>
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
                      {state === "complete" ? "✓" : stepNumber}
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
