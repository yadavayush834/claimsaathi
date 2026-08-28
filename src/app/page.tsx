import { AppShell } from "@/components/layout/app-shell";
import { ActionLink } from "@/components/ui/action-link";
import { StatusBadge } from "@/components/ui/status-badge";

import styles from "./page.module.css";

const journey = [
  {
    step: "01",
    label: "Prepare",
    badge: "Check & Plan",
    description:
      "Check the claim path, mock eligibility, and required details.",
  },
  {
    step: "02",
    label: "Apply",
    badge: "Fast & Clean",
    description:
      "Complete one guided synthetic application without portal hopping.",
  },
  {
    step: "03",
    label: "Track",
    badge: "Real-time updates",
    description: "See what changed, what is pending, and who needs to act.",
  },
  {
    step: "04",
    label: "Resolve",
    badge: "Rejection recovery",
    description: "Understand a problem and prepare the next safe step.",
  },
] as const;

const trustPoints = [
  {
    title: "No login",
    tag: "Instant Access",
    description: "Open the reviewer journey without an account or OTP.",
  },
  {
    title: "Synthetic only",
    tag: "Safe Sandbox",
    description: "Names, balances, documents, and claim events are fictional.",
  },
  {
    title: "No live connection",
    tag: "100% Independent",
    description: "Nothing is submitted to EPFO or another government system.",
  },
] as const;

export default function HomePage() {
  return (
    <AppShell currentStep={1}>
      <section className={styles.hero} aria-labelledby="page-title">
        <div className={styles.heroCopy}>
          <div className={styles.badgeWrapper}>
            <StatusBadge tone="info">PF withdrawal, made clearer</StatusBadge>
            <span className={styles.heroSpark}>✦ Citizen EPF Guide</span>
          </div>
          <h1 id="page-title">
            Withdraw your PF without guessing what comes next.
          </h1>
          <p className={styles.lede}>
            ClaimSaathi turns a fragmented withdrawal process into one guided
            route: prepare, apply, track, and recover when something goes wrong.
          </p>
          <div className={styles.actions}>
            <ActionLink href="/demo" className={styles.primaryCta}>
              Start with demo data <span aria-hidden="true">→</span>
            </ActionLink>
            <ActionLink href="#safety" variant="secondary">
              See what is simulated
            </ActionLink>
          </div>
          <div className={styles.securityNote}>
            <span className={styles.lockIcon} aria-hidden="true">
              🔒
            </span>
            <p className={styles.actionNote}>
              No account, password, Aadhaar, PAN, UAN, bank details, or OTP
              required.
            </p>
          </div>
        </div>

        <aside className={styles.routeCard} aria-label="ClaimSaathi journey">
          <div className={styles.routeHeader}>
            <p className={styles.routeEyebrow}>One guided route</p>
            <span className={styles.routePill}>4 Smart Steps</span>
          </div>
          <ol>
            {journey.map((step) => (
              <li key={step.label}>
                <span aria-hidden="true">{step.step}</span>
                <div className={styles.stepContent}>
                  <div className={styles.stepRow}>
                    <strong>{step.label}</strong>
                    <span className={styles.stepBadge}>{step.badge}</span>
                  </div>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <section className={styles.trustStrip} aria-label="Demo boundaries">
        {trustPoints.map(({ title, tag, description }) => (
          <div key={title} className={styles.trustCard}>
            <div className={styles.trustHeader}>
              <strong>{title}</strong>
              <span className={styles.trustTag}>{tag}</span>
            </div>
            <p>{description}</p>
          </div>
        ))}
      </section>

      <section className={styles.problem} aria-labelledby="problem-title">
        <header>
          <p className={styles.eyebrow}>The citizen problem</p>
          <h2 id="problem-title">A claim should not become a portal maze.</h2>
          <p className={styles.problemSubhead}>
            Millions of EPF claims fail each year due to confusing portals,
            opaque status codes, and unguided rejection notices.
          </p>
        </header>
        <div className={styles.problemRows}>
          <article className={styles.problemCard}>
            <span className={styles.problemPhase}>Before the claim</span>
            <div>
              <h3>Important checks are easy to miss.</h3>
              <p>
                Eligibility, KYC, bank details, and documents appear in separate
                places, so citizens often discover blockers too late.
              </p>
            </div>
          </article>
          <article className={styles.problemCard}>
            <span className={styles.problemPhase}>While it moves</span>
            <div>
              <h3>A status rarely explains the next action.</h3>
              <p>
                A short system label can leave a citizen unsure whether to wait,
                correct information, contact an employer, or raise a grievance.
              </p>
            </div>
          </article>
          <article className={styles.problemCard}>
            <span className={styles.problemPhase}>When it goes wrong</span>
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

      <section
        className={styles.safety}
        id="safety"
        aria-labelledby="safety-title"
      >
        <div className={styles.safetyIntro}>
          <p className={styles.eyebrow}>Trust boundary</p>
          <h2 id="safety-title">A realistic journey without real risk.</h2>
          <p>
            ClaimSaathi is an independent hackathon prototype. It does not
            access, automate, or replace EPFO. The experience demonstrates how
            the citizen journey could be clearer using fictional information.
          </p>
        </div>
        <div className={styles.safetyLedger}>
          <div className={styles.safetyCardSimulate}>
            <div className={styles.safetyCardHeader}>
              <span className={styles.safetyIcon} aria-hidden="true">
                ✓
              </span>
              <strong>The demo simulates</strong>
            </div>
            <p>
              Identity, balance, documents, OTP, submission, status, and
              grievance events.
            </p>
          </div>
          <div className={styles.safetyCardAvoid}>
            <div className={styles.safetyCardHeader}>
              <span className={styles.safetyIcon} aria-hidden="true">
                ✕
              </span>
              <strong>Never enter</strong>
            </div>
            <p>
              Real Aadhaar, PAN, UAN, bank details, passwords, OTPs, or personal
              documents.
            </p>
          </div>
          <div className={styles.safetyCardBoundary}>
            <div className={styles.safetyCardHeader}>
              <span className={styles.safetyIcon} aria-hidden="true">
                🛡️
              </span>
              <strong>Nothing leaves the demo</strong>
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
