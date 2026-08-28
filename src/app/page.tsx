import { AppShell } from "@/components/layout/app-shell";
import { ActionLink } from "@/components/ui/action-link";

import styles from "./page.module.css";

export default function HomePage() {
  return (
    <AppShell currentStep={1}>
      <div className={styles.gridContainer}>
        {/* HERO */}
        <section className={styles.hero} aria-labelledby="page-title">
          <h1 id="page-title" className={styles.heroTitle}>
            Withdraw your PF without guessing what comes next.
          </h1>
          <p className={styles.heroLede}>
            ClaimSaathi turns a fragmented withdrawal process into one guided
            route: prepare, apply, track, and recover when something goes wrong.
          </p>
          <div className={styles.heroActions}>
            <ActionLink href="/demo" className={styles.actionPrimary}>
              Start with demo data
            </ActionLink>
            <ActionLink href="#safety" className={styles.actionSecondary}>
              See what is simulated
            </ActionLink>
          </div>
        </section>

        {/* TRUST ACCENT */}
        <section className={styles.trustAccent} aria-label="Demo boundaries">
          <div className={styles.trustItem}>
            <span>01</span>
            <strong>NO LOGIN</strong>
            <p>Open the reviewer journey without an account or OTP.</p>
          </div>
          <div className={styles.trustItem}>
            <span>02</span>
            <strong>SYNTHETIC ONLY</strong>
            <p>Names, balances, documents, and claim events are fictional.</p>
          </div>
          <div className={styles.trustItem}>
            <span>03</span>
            <strong>NO LIVE CONNECTION</strong>
            <p>Nothing is submitted to EPFO or another government system.</p>
          </div>
        </section>

        {/* PROBLEM STATEMENT */}
        <section className={styles.problem} aria-labelledby="problem-title">
          <div className={styles.problemHeader}>
            <h2 id="problem-title">A CLAIM SHOULD NOT BECOME A PORTAL MAZE.</h2>
            <p>
              Millions of EPF claims face roadblocks each year due to confusing
              steps, opaque status updates, and unguided rejection notices.
            </p>
          </div>
          <div className={styles.problemList}>
            <article className={styles.problemRow}>
              <div className={styles.problemLabel}>BEFORE THE CLAIM</div>
              <div className={styles.problemContent}>
                <h3>Important checks are easy to miss.</h3>
                <p>
                  Eligibility, KYC, bank details, and documents appear in
                  separate places, so citizens often discover blockers too late.
                </p>
              </div>
            </article>
            <article className={styles.problemRow}>
              <div className={styles.problemLabel}>WHILE IT MOVES</div>
              <div className={styles.problemContent}>
                <h3>A status rarely explains the next action.</h3>
                <p>
                  A short system label can leave a citizen unsure whether to
                  wait, correct information, contact an employer, or raise a
                  grievance.
                </p>
              </div>
            </article>
            <article className={styles.problemRow}>
              <div className={styles.problemLabel}>WHEN IT GOES WRONG</div>
              <div className={styles.problemContent}>
                <h3>A rejection needs a recovery path.</h3>
                <p>
                  ClaimSaathi connects the reason, responsible party,
                  correction, and follow-up instead of leaving the citizen at a
                  dead end.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* SAFETY BOUNDARY */}
        <section
          className={styles.safety}
          id="safety"
          aria-labelledby="safety-title"
        >
          <div className={styles.safetyHeader}>
            <h2 id="safety-title">A REALISTIC JOURNEY WITHOUT REAL RISK.</h2>
            <p>
              ClaimSaathi is an independent prototype. It does not access,
              automate, or replace EPFO. The experience demonstrates how the
              citizen journey could be clearer using fictional information.
            </p>
          </div>
          <div className={styles.safetyList}>
            <div className={styles.safetyRow}>
              <div className={styles.safetyLabel}>[+] THE DEMO SIMULATES</div>
              <p>
                Identity, balance, documents, OTP, submission, status, and
                grievance events.
              </p>
            </div>
            <div className={styles.safetyRow}>
              <div className={styles.safetyLabel}>[-] NEVER ENTER</div>
              <p>
                Real Aadhaar, PAN, UAN, bank details, passwords, OTPs, or
                personal documents.
              </p>
            </div>
            <div className={styles.safetyRow}>
              <div className={styles.safetyLabel}>
                [=] NOTHING LEAVES THE DEMO
              </div>
              <p>
                It cannot file a claim, transfer money, or contact EPFO on your
                behalf.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
