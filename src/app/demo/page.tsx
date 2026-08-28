import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { ActionLink } from "@/components/ui/action-link";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";

import styles from "./demo.module.css";

export const metadata: Metadata = {
  title: "Demo workspace | ClaimSaathi",
};

const demoChecks = [
  ["Account", "Not required"],
  ["Personal data", "Not requested"],
  ["Government connection", "None"],
] as const;

export default function DemoPage() {
  return (
    <AppShell currentStep={1}>
      <div className={styles.page}>
        <header>
          <StatusBadge tone="success">No login required</StatusBadge>
          <h1>You&apos;re in demo mode.</h1>
          <p className={styles.lede}>
            No account was created and no government service was contacted. This
            workspace will use fictional information only.
          </p>
        </header>

        <Callout title="Phase boundary">
          Synthetic citizen profiles and mock claim behavior arrive in Phase 04.
          This phase proves that anyone can enter the demo without sharing
          credentials.
        </Callout>

        <dl className={styles.checks}>
          {demoChecks.map(([term, description]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{description}</dd>
            </div>
          ))}
        </dl>

        <ActionLink href="/" variant="secondary">
          Return to overview
        </ActionLink>
      </div>
    </AppShell>
  );
}
