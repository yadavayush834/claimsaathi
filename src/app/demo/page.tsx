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
          <div className={styles.badgeRow}>
            <StatusBadge tone="success">No login required</StatusBadge>
            <span className={styles.modeChip}>Sandbox Mode</span>
          </div>
          <h1>You&apos;re in demo mode.</h1>
          <p className={styles.lede}>
            No account was created and no government service was contacted. This
            workspace will use fictional information only.
          </p>
        </header>

        <Callout title="Synthetic data only">
          Every citizen, amount, claim reference, and event below comes from a
          versioned local fixture. It cannot look up a real member or claim.
        </Callout>

        <DemoSessionManager />

        <div className={styles.checksWrapper}>
          <p className={styles.checksTitle}>Demo Guarantees</p>
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
