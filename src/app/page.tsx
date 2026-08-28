import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";
import { TextField } from "@/components/ui/text-field";

import styles from "./page.module.css";

export default function HomePage() {
  return (
    <AppShell currentStep={1}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Design system preview</p>
        <h1>A calm interface for high-stakes moments.</h1>
        <p className={styles.lede}>
          Phase 02 establishes the visual language and reusable controls. The
          citizen landing journey begins in Phase 03.
        </p>
      </header>

      <div className={styles.docket}>
        <section className={styles.section} aria-labelledby="type-heading">
          <div className={styles.sectionLabel}>Type and status</div>
          <div className={styles.sectionBody}>
            <h2 id="type-heading">Information should feel steady.</h2>
            <p>
              Strong headings orient the citizen. Compact status labels make
              system state visible without turning the page into a dashboard.
            </p>
            <div className={styles.badgeRow} aria-label="Status examples">
              <StatusBadge tone="success">Ready</StatusBadge>
              <StatusBadge tone="warning">Needs attention</StatusBadge>
              <StatusBadge tone="info">In review</StatusBadge>
              <StatusBadge tone="critical">Action required</StatusBadge>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="action-heading">
          <div className={styles.sectionLabel}>Actions</div>
          <div className={styles.sectionBody}>
            <h2 id="action-heading">Every action says what happens next.</h2>
            <div className={styles.actionRow}>
              <Button>Continue</Button>
              <Button variant="secondary">Save for later</Button>
              <Button variant="quiet">Go back</Button>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="field-heading">
          <div className={styles.sectionLabel}>Form controls</div>
          <div className={styles.sectionBody}>
            <h2 id="field-heading">Labels and help stay attached.</h2>
            <div className={styles.fieldGrid}>
              <TextField
                id="claim-reference"
                label="Claim reference"
                hint="Use synthetic information in this prototype."
                placeholder="For example, DEMO-CLM-0241"
              />
              <TextField
                id="amount-example"
                label="Requested amount"
                error="Enter an amount greater than zero."
                defaultValue="0"
                inputMode="numeric"
              />
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="guidance-heading">
          <div className={styles.sectionLabel}>Guidance</div>
          <div className={styles.sectionBody}>
            <h2 id="guidance-heading">Important context stays in the flow.</h2>
            <Callout title="Independent demo">
              This interface is not connected to EPFO. Later phases will use
              synthetic claims and simulated actions only.
            </Callout>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
