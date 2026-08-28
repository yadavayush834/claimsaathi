import { AppShell } from "@/components/layout/app-shell";
import { ActionLink } from "@/components/ui/action-link";
import { StatusBadge } from "@/components/ui/status-badge";

import styles from "./page.module.css";

const journey = [
  {
    label: "Prepare",
    description:
      "Check the claim path, mock eligibility, and required details.",
  },
  {
    label: "Apply",
    description:
      "Complete one guided synthetic application without portal hopping.",
  },
  {
    label: "Track",
    description: "See what changed, what is pending, and who needs to act.",
  },
  {
    label: "Resolve",
    description: "Understand a problem and prepare the next safe step.",
  },
] as const;

const trustPoints = [
  ["No login", "Open the reviewer journey without an account or OTP."],
  [
    "Synthetic only",
    "Names, balances, documents, and claim events are fictional.",
  ],
  [
    "No live connection",
    "Nothing is submitted to EPFO or another government system.",
  ],
] as const;

export default function HomePage() {
  return (
    <AppShell currentStep={1}>
      <section className={styles.hero} aria-labelledby="page-title">
        <div className={styles.heroCopy}>
          <StatusBadge tone="info">PF withdrawal, made clearer</StatusBadge>
          <h1 id="page-title">
            Withdraw your PF without guessing what comes next.
          </h1>
          <p className={styles.lede}>
            ClaimSaathi turns a fragmented withdrawal process into one guided
            route: prepare, apply, track, and recover when something goes wrong.
          </p>
          <div className={styles.actions}>
            <ActionLink href="/demo">Start with demo data</ActionLink>
            <ActionLink href="#safety" variant="secondary">
              See what is simulated
            </ActionLink>
          </div>
          <p className={styles.actionNote}>
            No account, password, Aadhaar, PAN, UAN, bank details, or OTP
            required.
          </p>
        </div>

        <aside className={styles.routeCard} aria-label="ClaimSaathi journey">
          <p className={styles.routeEyebrow}>One guided route</p>
          <ol>
            {journey.map((step, index) => (
              <li key={step.label}>
                <span aria-hidden="true">{index + 1}</span>
                <div>
                  <strong>{step.label}</strong>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <section className={styles.trustStrip} aria-label="Demo boundaries">
        {trustPoints.map(([title, description]) => (
          <div key={title}>
            <strong>{title}</strong>
            <p>{description}</p>
          </div>
        ))}
      </section>

      <section className={styles.problem} aria-labelledby="problem-title">
        <header>
          <p className={styles.eyebrow}>The citizen problem</p>
          <h2 id="problem-title">A claim should not become a portal maze.</h2>
        </header>
        <div className={styles.problemRows}>
          <article>
            <span>Before the claim</span>
            <div>
              <h3>Important checks are easy to miss.</h3>
              <p>
                Eligibility, KYC, bank details, and documents appear in separate
                places, so citizens often discover blockers too late.
              </p>
            </div>
          </article>
          <article>
            <span>While it moves</span>
            <div>
              <h3>A status rarely explains the next action.</h3>
              <p>
                A short system label can leave a citizen unsure whether to wait,
                correct information, contact an employer, or raise a grievance.
              </p>
            </div>
          </article>
          <article>
            <span>When it goes wrong</span>
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
        <div>
          <p className={styles.eyebrow}>Trust boundary</p>
          <h2 id="safety-title">A realistic journey without real risk.</h2>
          <p>
            ClaimSaathi is an independent hackathon prototype. It does not
            access, automate, or replace EPFO. The experience demonstrates how
            the citizen journey could be clearer using fictional information.
          </p>
        </div>
        <div className={styles.safetyLedger}>
          <div>
            <strong>The demo simulates</strong>
            <p>
              Identity, balance, documents, OTP, submission, status, and
              grievance events.
            </p>
          </div>
          <div>
            <strong>Never enter</strong>
            <p>
              Real Aadhaar, PAN, UAN, bank details, passwords, OTPs, or personal
              documents.
            </p>
          </div>
          <div>
            <strong>Nothing leaves the demo</strong>
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
