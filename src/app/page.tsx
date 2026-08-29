import { AppShell } from "@/components/layout/app-shell";
import { ActionLink } from "@/components/ui/action-link";

import styles from "./page.module.css";

export default function HomePage() {
  return (
    <AppShell currentStep={1}>
      <div className={styles.page}>
        {/* HERO */}
        <section className={styles.hero} aria-labelledby="page-title">
          <span className={styles.heroEyebrow}>
            Citizen EPF withdrawal prototype
          </span>
          <h1 id="page-title" className={styles.heroTitle}>
            Withdraw your PF{" "}
            <span className={styles.heroTitleAccent}>without guessing</span>{" "}
            what comes next.
          </h1>
          <p className={styles.heroLede}>
            ClaimSaathi turns a fragmented withdrawal process into one guided
            route: prepare, apply, track, and recover when something goes wrong.
          </p>
          <div className={styles.heroActions}>
            <ActionLink href="/demo" variant="primary">
              Start with demo data
            </ActionLink>
            <ActionLink href="#safety" variant="secondary">
              See what is simulated
            </ActionLink>
          </div>
        </section>

        {/* TRUST ACCENT */}
        <section className={styles.trustAccent} aria-label="Demo boundaries">
          <article className={styles.trustCard}>
            <span className={styles.trustIndex}>01</span>
            <h3 className={styles.trustTitle}>No login</h3>
            <p className={styles.trustText}>
              Open the reviewer journey without an account or OTP.
            </p>
          </article>
          <article className={styles.trustCard}>
            <span className={styles.trustIndex}>02</span>
            <h3 className={styles.trustTitle}>Synthetic only</h3>
            <p className={styles.trustText}>
              Names, balances, documents, and claim events are fictional.
            </p>
          </article>
          <article className={styles.trustCard}>
            <span className={styles.trustIndex}>03</span>
            <h3 className={styles.trustTitle}>No live connection</h3>
            <p className={styles.trustText}>
              Nothing is submitted to EPFO or another government system.
            </p>
          </article>
        </section>

        {/* PROBLEM STATEMENT */}
        <section className={styles.section} aria-labelledby="problem-title">
          <header className={styles.sectionHeading}>
            <span className={styles.sectionEyebrow}>The problem</span>
            <h2 id="problem-title" className={styles.sectionTitle}>
              A claim should not become a portal maze.
            </h2>
            <p className={styles.sectionIntro}>
              Millions of EPF claims face roadblocks each year due to confusing
              steps, opaque status updates, and unguided rejection notices.
            </p>
          </header>

          <div className={styles.sectionList}>
            <article className={styles.sectionRow}>
              <span className={styles.rowLabel}>Before the claim</span>
              <h3 className={styles.rowHeading}>
                Important checks are easy to miss.
              </h3>
              <p className={styles.rowText}>
                Eligibility, KYC, bank details, and documents appear in separate
                places, so citizens often discover blockers too late.
              </p>
            </article>
            <article className={styles.sectionRow}>
              <span className={styles.rowLabel}>While it moves</span>
              <h3 className={styles.rowHeading}>
                A status rarely explains the next action.
              </h3>
              <p className={styles.rowText}>
                A short system label can leave a citizen unsure whether to wait,
                correct information, contact an employer, or raise a grievance.
              </p>
            </article>
            <article className={styles.sectionRow}>
              <span className={styles.rowLabel}>When it goes wrong</span>
              <h3 className={styles.rowHeading}>
                A rejection needs a recovery path.
              </h3>
              <p className={styles.rowText}>
                ClaimSaathi connects the reason, responsible party, correction,
                and follow-up instead of leaving the citizen at a dead end.
              </p>
            </article>
          </div>
        </section>

        {/* SAFETY BOUNDARY */}
        <section
          className={`${styles.section} ${styles.safety}`}
          id="safety"
          aria-labelledby="safety-title"
        >
          <header className={styles.sectionHeading}>
            <span className={styles.sectionEyebrow}>The safety boundary</span>
            <h2 id="safety-title" className={styles.sectionTitle}>
              A realistic journey without real risk.
            </h2>
            <p className={styles.sectionIntro}>
              ClaimSaathi is an independent prototype. It does not access,
              automate, or replace EPFO. The experience demonstrates how the
              citizen journey could be clearer using fictional information.
            </p>
          </header>

          <div className={styles.sectionList}>
            <article className={styles.sectionRow}>
              <span className={styles.rowLabel} data-tone="simulate">
                The demo simulates
              </span>
              <h3 className={styles.rowHeading}>
                Identity, balance, documents, OTP, submission, status, and
                grievance events.
              </h3>
            </article>
            <article className={styles.sectionRow}>
              <span className={styles.rowLabel} data-tone="never">
                Never enter
              </span>
              <h3 className={styles.rowHeading}>
                Real Aadhaar, PAN, UAN, bank details, passwords, OTPs, or
                personal documents.
              </h3>
            </article>
            <article className={styles.sectionRow}>
              <span className={styles.rowLabel} data-tone="isolated">
                Nothing leaves the demo
              </span>
              <h3 className={styles.rowHeading}>
                It cannot file a claim, transfer money, or contact EPFO on your
                behalf.
              </h3>
            </article>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
