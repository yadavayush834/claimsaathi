import { AppShell } from "@/components/layout/app-shell";
import { ActionLink } from "@/components/ui/action-link";

import styles from "./page.module.css";

type TrustPoint = {
  title: string;
  tag: string;
  description: string;
  icon?: string;
};

const trustPoints: readonly TrustPoint[] = [
  {
    title: "NO LOGIN",
    tag: "INSTANT ACCESS",
    description: "Open the reviewer journey without an account or OTP.",
  },
  {
    title: "SYNTHETIC ONLY",
    tag: "SAFE SANDBOX",
    description: "Names, balances, documents, and claim events are fictional.",
  },
  {
    title: "NO LIVE CONNECTION",
    tag: "100% INDEPENDENT",
    icon: "📡",
    description: "Nothing is submitted to EPFO or another government system.",
  },
];

export default function HomePage() {
  return (
    <AppShell currentStep={1}>
      <section className={styles.hero} aria-labelledby="page-title">
        <div className={styles.heroCopy}>
          <h1 id="page-title">
            Withdraw your PF without guessing what comes next.
          </h1>
          <p className={styles.lede}>
            ClaimSaathi turns a fragmented withdrawal process into one guided
            route: prepare, apply, track, and recover when something goes wrong.
          </p>
          <div className={styles.actions}>
            <ActionLink href="/demo" className={styles.textLinkPrimary}>
              Start with demo data <span aria-hidden="true">→</span>
            </ActionLink>
            <ActionLink
              href="#safety"
              variant="quiet"
              className={styles.textLinkSecondary}
            >
              See what is simulated
            </ActionLink>
          </div>
        </div>
      </section>

      {/* Trust Strip with vertical pipe accents */}
      <section className={styles.trustStrip} aria-label="Demo boundaries">
        {trustPoints.map(({ title, tag, icon, description }) => (
          <div key={title} className={styles.trustCard}>
            <div className={styles.trustHeader}>
              <span className={styles.trustBar} aria-hidden="true" />
              <div>
                <div className={styles.trustTitleRow}>
                  {icon && (
                    <span className={styles.trustIcon} aria-hidden="true">
                      {icon}
                    </span>
                  )}
                  <strong>{title}</strong>
                </div>
                <span className={styles.trustTag}>{tag}</span>
              </div>
            </div>
            <p className={styles.trustDesc}>{description}</p>
          </div>
        ))}
      </section>

      {/* Clean borderless Citizen Problem section matching user's request */}
      <section className={styles.problem} aria-labelledby="problem-title">
        <header className={styles.sectionHeader}>
          <p className={styles.eyebrow}>THE CITIZEN PROBLEM</p>
          <h2 id="problem-title">A CLAIM SHOULD NOT BECOME A PORTAL MAZE.</h2>
          <p className={styles.problemSubhead}>
            Millions of EPF claims face roadblocks each year due to confusing
            steps, opaque status updates, and unguided rejection notices.
          </p>
        </header>
        <div className={styles.problemRows}>
          <article className={styles.problemItem}>
            <p className={styles.problemPhase}>BEFORE THE CLAIM</p>
            <div>
              <h3>Important checks are easy to miss.</h3>
              <p>
                Eligibility, KYC, bank details, and documents appear in separate
                places, so citizens often discover blockers too late.
              </p>
            </div>
          </article>
          <article className={styles.problemItem}>
            <p className={styles.problemPhase}>WHILE IT MOVES</p>
            <div>
              <h3>A status rarely explains the next action.</h3>
              <p>
                A short system label can leave a citizen unsure whether to wait,
                correct information, contact an employer, or raise a grievance.
              </p>
            </div>
          </article>
          <article className={styles.problemItem}>
            <p className={styles.problemPhase}>WHEN IT GOES WRONG</p>
            <div>
              <h3>A rejection needs a recovery path.</h3>
              <p>
                ClaimSaathi connects the reason, responsible party, correction,
                and follow-up instead of leaving the citizen at a dead end.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Clean borderless Trust Boundary section */}
      <section
        className={styles.safety}
        id="safety"
        aria-labelledby="safety-title"
      >
        <div className={styles.safetyIntro}>
          <p className={styles.eyebrow}>TRUST BOUNDARY</p>
          <h2 id="safety-title">A REALISTIC JOURNEY WITHOUT REAL RISK.</h2>
          <p>
            ClaimSaathi is an independent prototype. It does not access,
            automate, or replace EPFO. The experience demonstrates how the
            citizen journey could be clearer using fictional information.
          </p>
        </div>
        <div className={styles.safetyLedger}>
          <div className={styles.safetyItem}>
            <div className={styles.safetyItemHeader}>
              <span className={styles.safetyIconSuccess} aria-hidden="true">
                ✓
              </span>
              <strong>THE DEMO SIMULATES</strong>
            </div>
            <p>
              Identity, balance, documents, OTP, submission, status, and
              grievance events.
            </p>
          </div>
          <div className={styles.safetyItem}>
            <div className={styles.safetyItemHeader}>
              <span className={styles.safetyIconCritical} aria-hidden="true">
                ✕
              </span>
              <strong>NEVER ENTER</strong>
            </div>
            <p>
              Real Aadhaar, PAN, UAN, bank details, passwords, OTPs, or personal
              documents.
            </p>
          </div>
          <div className={styles.safetyItem}>
            <div className={styles.safetyItemHeader}>
              <span className={styles.safetyIconInfo} aria-hidden="true">
                🛡️
              </span>
              <strong>NOTHING LEAVES THE DEMO</strong>
            </div>
            <p>
              It cannot file a claim, transfer money, or contact EPFO on your
              behalf.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
