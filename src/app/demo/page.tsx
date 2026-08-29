import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { ActionLink } from "@/components/ui/action-link";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";

import { DemoSessionManager } from "./demo-session-manager";
import styles from "./demo.module.css";

export const metadata: Metadata = {
  title: "Demo workspace | ClaimSaathi",
};

const demoChecks = [
  ["Account", "Not required"],
  ["Personal data", "Not requested"],
  ["Government connection", "None"],
  ["Session recovery", "This browser only"],
] as const;

export default function DemoPage() {
  return (
    <AppShell currentStep={1}>
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.introCopy}>
            <div className={styles.badgeRow}>
              <StatusBadge tone="success">No login required</StatusBadge>
              <span className={styles.modeChip}>Safe sandbox</span>
            </div>
            <h1>You&apos;re in demo mode.</h1>
            <p className={styles.lede}>
              Choose a fictional citizen and experience the withdrawal journey
              from their point of view. Nothing connects to a government system.
            </p>
          </div>
          <div className={styles.demoStamp} aria-hidden="true">
            <span>Reviewer journey</span>
            <strong>DEMO</strong>
            <small>Fictional data · local browser session</small>
          </div>
        </header>

        <div className={styles.calloutWrap}>
          <Callout title="Synthetic data only">
            Every citizen, amount, claim reference, and event below comes from a
            versioned local fixture. It cannot look up a real member or claim.
          </Callout>
        </div>

        <DemoSessionManager />

        <div className={styles.checksWrapper}>
          <div className={styles.checksHeading}>
            <p className={styles.checksTitle}>Demo guarantees</p>
            <span>These boundaries remain active throughout the journey.</span>
          </div>
          <dl className={styles.checks}>
            {demoChecks.map(([term, description]) => (
              <div key={term} className={styles.checkCard}>
                <dt>
                  <span className={styles.checkIcon} aria-hidden="true">
                    ✓
                  </span>
                  {term}
                </dt>
                <dd>{description}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ActionLink href="/" variant="secondary" className={styles.backBtn}>
          ← Return to overview
        </ActionLink>
      </div>
    </AppShell>
  );
}
