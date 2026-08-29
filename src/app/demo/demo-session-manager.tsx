"use client";

import { useEffect, useState } from "react";

import { demoDataService } from "@/lib/demo/demo-service";
import type { DemoCase, DemoPersonaId } from "@/lib/demo/model";
import { createDemoSessionStore } from "@/lib/demo/session-store";

import { ClaimWorkspace } from "./claim-workspace";
import styles from "./demo-session-manager.module.css";
import { KycPreflight } from "./kyc-preflight";
import { MockClaimForm } from "./mock-claim-form";
import { WithdrawalPlanner } from "./withdrawal-planner";

type SessionView =
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "choosing" }>
  | Readonly<{
      status: "active";
      demoCase: DemoCase;
      source: "started" | "restored";
      persisted: boolean;
    }>;

const demoCases = demoDataService.listCases();

export function DemoSessionManager() {
  const [view, setView] = useState<SessionView>({ status: "loading" });
  const [plannerCase, setPlannerCase] = useState<DemoCase | null>(null);
  const [preflightCase, setPreflightCase] = useState<DemoCase | null>(null);
  const [claimFormCase, setClaimFormCase] = useState<DemoCase | null>(null);

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
    setPlannerCase(null);
    setPreflightCase(null);
    setClaimFormCase(null);
    setView({
      status: "active",
      demoCase: selectedCase,
      source: "started",
      persisted: store.save(personaId),
    });
  }

  function switchCase() {
    createDemoSessionStore(window.localStorage).clear();
    setPlannerCase(null);
    setPreflightCase(null);
    setClaimFormCase(null);
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

  if (plannerCase) {
    return (
      <WithdrawalPlanner
        demoCase={plannerCase}
        onBack={() => setPlannerCase(null)}
        onStartMockClaim={() => {
          setPlannerCase(null);
          setClaimFormCase(plannerCase);
        }}
      />
    );
  }

  if (preflightCase) {
    return (
      <KycPreflight
        demoCase={preflightCase}
        onBack={() => setPreflightCase(null)}
      />
    );
  }

  if (claimFormCase) {
    return (
      <MockClaimForm
        demoCase={claimFormCase}
        onBack={() => setClaimFormCase(null)}
      />
    );
  }

  return (
    <ClaimWorkspace
      demoCase={view.demoCase}
      onPlanWithdrawal={
        view.demoCase.persona.id === "asha-planning"
          ? () => setPlannerCase(view.demoCase)
          : undefined
      }
      onReviewPreflight={
        view.demoCase.persona.id === "imran-returned"
          ? () => setPreflightCase(view.demoCase)
          : undefined
      }
      sessionMessage={
        view.persisted
          ? view.source === "restored"
            ? "Session restored after refresh."
            : "Session saved for refresh recovery."
          : "Browser storage is blocked, so refresh may reset this case."
      }
      onSwitch={switchCase}
    />
  );
}
