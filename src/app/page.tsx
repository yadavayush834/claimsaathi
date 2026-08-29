import { AppShell } from "@/components/layout/app-shell";
import { ActionLink } from "@/components/ui/action-link";

import { JourneyPreview } from "./journey-preview";
import styles from "./page.module.css";

const journeyMoments = [
  {
    number: "01",
    label: "Before the claim",
    title: "Plan with the real numbers in view.",
    description:
      "Understand the mock eligible amount, what stays protected, and which readiness check needs attention before filling a form.",
    outcome: "Fewer late surprises",
  },
  {
    number: "02",
    label: "While it moves",
    title: "Turn every status into an instruction.",
    description:
      "See whether to wait, correct a detail, contact an employer, or gather evidence—without translating portal shorthand yourself.",
    outcome: "One clear next action",
  },
  {
    number: "03",
    label: "When it goes wrong",
    title: "Recover without starting from zero.",
    description:
      "Keep the reason, responsible person, correction checklist, and grievance path connected to the same fictional claim.",
    outcome: "No dead-end rejection",
  },
] as const;

const safetyRows = [
  ["The demo uses", "Fictional people, balances, documents, OTPs and events"],
  ["You should never enter", "Real Aadhaar, PAN, UAN, bank or login details"],
  ["The prototype cannot", "File a claim, move money or contact EPFO"],
] as const;

export default function HomePage() {
  return (
    <AppShell currentStep={1}>
      <div className={styles.page}>
        <section className={styles.hero} aria-labelledby="page-title">
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <span aria-hidden="true">CS</span>
              Independent EPF withdrawal prototype
            </div>
            <h1 id="page-title">
              Withdraw your PF <span>without guessing</span> what comes next.
            </h1>
            <p className={styles.heroLede}>
              ClaimSaathi gives every balance, status, and rejection a plain
              explanation—and one useful next action.
            </p>
            <div className={styles.heroActions}>
              <ActionLink href="/demo" className={styles.primaryAction}>
                Try the citizen journey <span aria-hidden="true">→</span>
              </ActionLink>
              <ActionLink
                href="#how-it-works"
                variant="secondary"
                className={styles.secondaryAction}
              >
                See how it helps
              </ActionLink>
            </div>
            <p className={styles.heroNote}>
              <span aria-hidden="true">✓</span> Opens instantly with fictional
              data. No login or government connection.
            </p>
          </div>

          <JourneyPreview />
        </section>

        <section className={styles.trustRail} aria-label="Demo boundaries">
          <div>
            <span className={styles.trustIcon} aria-hidden="true">
              ↗
            </span>
            <p>
              <strong>No account</strong>
              Start the full reviewer journey without a login or OTP.
            </p>
          </div>
          <div>
            <span className={styles.trustIcon} aria-hidden="true">
              ◎
            </span>
            <p>
              <strong>Synthetic by design</strong>
              Every person, balance, document and claim event is fictional.
            </p>
          </div>
          <div>
            <span className={styles.trustIcon} aria-hidden="true">
              ⌁
            </span>
            <p>
              <strong>No live connection</strong>
              Nothing is submitted to EPFO or another government system.
            </p>
          </div>
        </section>

        <section
          className={styles.howSection}
          id="how-it-works"
          aria-labelledby="how-title"
        >
          <div className={styles.sectionIntro}>
            <p className={styles.sectionKicker}>One connected route</p>
            <h2 id="how-title">A claim should feel guided, not decoded.</h2>
            <p>
              The current experience spreads important decisions across pages,
              labels, and offices. ClaimSaathi keeps the citizen&apos;s question
              and the next useful action together.
            </p>
          </div>

          <div className={styles.momentList}>
            {journeyMoments.map((moment) => (
              <article key={moment.number} className={styles.moment}>
                <div className={styles.momentNumber}>{moment.number}</div>
                <div className={styles.momentCopy}>
                  <span>{moment.label}</span>
                  <h3>{moment.title}</h3>
                  <p>{moment.description}</p>
                </div>
                <div className={styles.momentOutcome}>
                  <span aria-hidden="true">✓</span>
                  {moment.outcome}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className={styles.safety}
          id="safety"
          aria-labelledby="safety-title"
        >
          <div className={styles.safetyCopy}>
            <p className={styles.sectionKicker}>Clear safety boundary</p>
            <h2 id="safety-title">
              Useful enough to feel real. Safe enough to explore.
            </h2>
            <p>
              ClaimSaathi is an independent prototype, not an EPFO service. It
              demonstrates a clearer citizen journey without touching a real
              account or government system.
            </p>
            <ActionLink href="/demo" className={styles.safetyAction}>
              Open the safe demo <span aria-hidden="true">→</span>
            </ActionLink>
          </div>

          <div className={styles.safetySheet}>
            <div className={styles.sheetTop}>
              <span>Prototype boundary</span>
              <strong>Always visible</strong>
            </div>
            <dl>
              {safetyRows.map(([term, description]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.sheetFoot}>
              <span aria-hidden="true">i</span>
              Mocked behavior is labelled throughout the journey.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
