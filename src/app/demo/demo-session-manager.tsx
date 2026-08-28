"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoDataService } from "@/lib/demo/demo-service";
import type { DemoCase, DemoPersonaId } from "@/lib/demo/model";
import { createDemoSessionStore } from "@/lib/demo/session-store";

import styles from "./demo-session-manager.module.css";

type SessionView =
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "choosing" }>
  | Readonly<{
      status: "active";
      demoCase: DemoCase;
      source: "started" | "restored";
      persisted: boolean;
    }>;

const claimStatusLabels = {
  draft: "Ready to plan",
  action_needed: "Needs a correction",
  settled: "Mock settlement recorded",
} as const;

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const demoCases = demoDataService.listCases();

export function DemoSessionManager() {
  const [view, setView] = useState<SessionView>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      const store = createDemoSessionStore(window.localStorage);
      const session = store.load();
      const restoredCase = session
        ? demoDataService.loadCase(session.personaId)
        : null;

      if (!cancelled) {
        setView(
          restoredCase
            ? {
                status: "active",
                demoCase: restoredCase,
                source: "restored",
                persisted: true,
              }
            : { status: "choosing" },
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  function startCase(personaId: DemoPersonaId) {
    const selectedCase = demoDataService.loadCase(personaId);

    if (!selectedCase) {
      return;
    }

    const store = createDemoSessionStore(window.localStorage);
    setView({
      status: "active",
      demoCase: selectedCase,
      source: "started",
      persisted: store.save(personaId),
    });
  }

  function switchCase() {
    createDemoSessionStore(window.localStorage).clear();
    setView({ status: "choosing" });
  }

  if (view.status === "loading") {
    return (
      <section className={styles.loading} aria-live="polite">
        <strong>Opening the safe demo…</strong>
        <p>Checking this browser for a saved fictional case.</p>
      </section>
    );
  }

  if (view.status === "choosing") {
    return (
      <section className={styles.manager} aria-labelledby="choose-case-title">
        <div className={styles.sectionHeading}>
          <p>Demo case files · fixture v{demoDataService.fixtureVersion}</p>
          <h2 id="choose-case-title">Choose a fictional citizen</h2>
          <span>
            Each case starts at a different point in the same mock withdrawal
            journey.
          </span>
        </div>

        <ul className={styles.caseList}>
          {demoCases.map((demoCase, index) => (
            <li key={demoCase.persona.id}>
              <button
                type="button"
                className={styles.caseButton}
                aria-label={`Start ${demoCase.persona.displayName}'s demo case`}
                onClick={() => startCase(demoCase.persona.id)}
              >
                <span className={styles.caseIndex}>
                  <small>Case</small>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.caseBody}>
                  <small>
                    Fictional citizen · {demoCase.persona.homeState}
                  </small>
                  <strong>{demoCase.persona.displayName}</strong>
                  <span>{demoCase.persona.scenarioTitle}</span>
                  <p>{demoCase.persona.scenarioDescription}</p>
                </span>
                <span className={styles.caseAction} aria-hidden="true">
                  Start case <b>→</b>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  const { claim, persona } = view.demoCase;

  return (
    <section className={styles.activePanel} aria-labelledby="active-case-title">
      <header className={styles.activeHeader}>
        <div>
          <p>
            Current fictional citizen · fixture v{view.demoCase.fixtureVersion}
          </p>
          <h2 id="active-case-title">{persona.displayName}</h2>
        </div>
        <StatusBadge tone="success">Demo session active</StatusBadge>
      </header>

      <p className={styles.scenario}>{persona.scenarioDescription}</p>

      <dl className={styles.caseDetails}>
        <div>
          <dt>Claim reference</dt>
          <dd>{claim.id}</dd>
        </div>
        <div>
          <dt>Requested amount</dt>
          <dd>{currencyFormatter.format(claim.requestedAmountRupees)}</dd>
        </div>
        <div>
          <dt>Case state</dt>
          <dd>{claimStatusLabels[claim.status]}</dd>
        </div>
      </dl>

      <p className={styles.recoveryNote} aria-live="polite">
        {view.persisted
          ? view.source === "restored"
            ? "Session restored after refresh. This browser remembered only the fictional case id."
            : "Session saved. Refresh this page and the fictional case will return."
          : "The case is open, but this browser blocked local storage, so refresh may reset it."}
      </p>

      <Button variant="secondary" onClick={switchCase}>
        Switch demo citizen
      </Button>
    </section>
  );
}
