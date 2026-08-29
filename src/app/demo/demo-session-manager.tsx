"use client";

import { useState } from "react";

import { ClaimIssueInterpreter } from "@/app/demo/claim-issue-interpreter";
import { ClaimTimeline } from "@/app/demo/claim-timeline";
import { ClaimWorkspace } from "@/app/demo/claim-workspace";
import { GrievanceManager } from "@/app/demo/grievance-manager";
import { KycPreflight } from "@/app/demo/kyc-preflight";
import { MockClaimForm } from "@/app/demo/mock-claim-form";
import { RejectionRecoveryJourney } from "@/app/demo/rejection-recovery-journey";
import { SettlementReconciliation } from "@/app/demo/settlement-reconciliation";
import { WithdrawalPlanner } from "@/app/demo/withdrawal-planner";
import { demoDataService } from "@/lib/demo/demo-service";
import type { DemoCase, DemoPersonaId } from "@/lib/demo/model";
import { createDemoSessionStore } from "@/lib/demo/session-store";
import { useLocale } from "@/lib/i18n/locale-context";

import styles from "./demo-session-manager.module.css";

type ViewState =
  | { readonly status: "loading" }
  | { readonly status: "choosing" }
  | {
      readonly status: "active";
      readonly demoCase: DemoCase;
      readonly source: "started" | "restored";
      readonly persisted: boolean;
    };

export function DemoSessionManager() {
  const { locale } = useLocale();

  const [view, setView] = useState<ViewState>(() => {
    if (typeof window === "undefined" || !window.localStorage) {
      return { status: "choosing" };
    }

    try {
      const store = createDemoSessionStore(window.localStorage);
      const savedSession = store.load();

      if (!savedSession) {
        return { status: "choosing" };
      }

      const savedCase = demoDataService.loadCase(savedSession.personaId);
      if (!savedCase) {
        store.clear();
        return { status: "choosing" };
      }

      return {
        status: "active",
        demoCase: savedCase,
        source: "restored",
        persisted: true,
      };
    } catch {
      return { status: "choosing" };
    }
  });

  const [plannerCase, setPlannerCase] = useState<DemoCase | null>(null);
  const [preflightCase, setPreflightCase] = useState<DemoCase | null>(null);
  const [claimFormCase, setClaimFormCase] = useState<DemoCase | null>(null);
  const [timelineCase, setTimelineCase] = useState<DemoCase | null>(null);
  const [interpreterCase, setInterpreterCase] = useState<DemoCase | null>(null);
  const [recoveryCase, setRecoveryCase] = useState<DemoCase | null>(null);
  const [reconciliationCase, setReconciliationCase] = useState<DemoCase | null>(
    null,
  );
  const [grievanceCase, setGrievanceCase] = useState<DemoCase | null>(null);

  const demoCases = demoDataService.listCases();

  function startCase(personaId: DemoPersonaId) {
    const selectedCase = demoDataService.loadCase(personaId);
    if (!selectedCase) {
      return;
    }

    const store = createDemoSessionStore(window.localStorage);
    setPlannerCase(null);
    setPreflightCase(null);
    setClaimFormCase(null);
    setTimelineCase(null);
    setInterpreterCase(null);
    setRecoveryCase(null);
    setReconciliationCase(null);
    setGrievanceCase(null);
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
    setTimelineCase(null);
    setInterpreterCase(null);
    setRecoveryCase(null);
    setReconciliationCase(null);
    setGrievanceCase(null);
    setView({ status: "choosing" });
  }

  if (view.status === "loading") {
    return (
      <section className={styles.loading} aria-live="polite">
        <strong>
          {locale === "hi" ? "डेमो खोला जा रहा है…" : "Opening the safe demo…"}
        </strong>
        <p>
          {locale === "hi"
            ? "ब्राउज़र में सहेजे गए सत्र की जांच की जा रही है।"
            : "Checking this browser for a saved fictional case."}
        </p>
      </section>
    );
  }

  if (view.status === "choosing") {
    return (
      <section className={styles.manager} aria-labelledby="choose-case-title">
        <div className={styles.sectionHeading}>
          <p>
            {locale === "hi"
              ? `डेमो केस फाइलें · फिक्सचर v${demoDataService.fixtureVersion}`
              : `Demo case files · fixture v${demoDataService.fixtureVersion}`}
          </p>
          <h2 id="choose-case-title">
            {locale === "hi"
              ? "काल्पनिक नागरिक चुनें"
              : "Choose a fictional citizen"}
          </h2>
          <span>
            {locale === "hi"
              ? "प्रत्येक केस निकासी यात्रा के अलग-अलग चरण पर शुरू होता है।"
              : "Each case starts at a different point in the same mock withdrawal journey."}
          </span>
        </div>

        <ul className={styles.caseList}>
          {demoCases.map((demoCase, index) => (
            <li key={demoCase.persona.id}>
              <button
                type="button"
                className={styles.caseButton}
                aria-label={
                  locale === "hi"
                    ? `${demoCase.persona.displayName} का डेमो केस शुरू करें`
                    : `Start ${demoCase.persona.displayName}'s demo case`
                }
                onClick={() => startCase(demoCase.persona.id)}
              >
                <span className={styles.caseIndex}>
                  <small>{locale === "hi" ? "केस" : "Case"}</small>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.caseBody}>
                  <small>
                    {locale === "hi"
                      ? `काल्पनिक नागरिक · ${demoCase.persona.homeState}`
                      : `Fictional citizen · ${demoCase.persona.homeState}`}
                  </small>
                  <strong>{demoCase.persona.displayName}</strong>
                  <span>{demoCase.persona.scenarioTitle}</span>
                  <p>{demoCase.persona.scenarioDescription}</p>
                </span>
                <span className={styles.caseAction} aria-hidden="true">
                  {locale === "hi" ? "केस शुरू करें" : "Start case"} <b>→</b>
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
        onViewTimeline={() => {
          const current = claimFormCase;
          setClaimFormCase(null);
          setTimelineCase(current);
        }}
      />
    );
  }

  if (timelineCase) {
    return (
      <ClaimTimeline
        demoCase={timelineCase}
        onBack={() => setTimelineCase(null)}
        onStartRecovery={
          timelineCase.persona.id === "imran-returned"
            ? () => {
                const current = timelineCase;
                setTimelineCase(null);
                setRecoveryCase(current);
              }
            : undefined
        }
      />
    );
  }

  if (interpreterCase) {
    return (
      <ClaimIssueInterpreter
        demoCase={interpreterCase}
        onBack={() => setInterpreterCase(null)}
        onOpenPreflight={() => {
          const current = interpreterCase;
          setInterpreterCase(null);
          setPreflightCase(current);
        }}
      />
    );
  }

  if (recoveryCase) {
    return (
      <RejectionRecoveryJourney
        demoCase={recoveryCase}
        onBack={() => setRecoveryCase(null)}
        onOpenPreflight={() => {
          const current = recoveryCase;
          setRecoveryCase(null);
          setPreflightCase(current);
        }}
        onStartResubmission={() => {
          const current = recoveryCase;
          setRecoveryCase(null);
          setClaimFormCase(current);
        }}
        onViewTimeline={() => {
          const current = recoveryCase;
          setRecoveryCase(null);
          setTimelineCase(current);
        }}
      />
    );
  }

  if (reconciliationCase) {
    return (
      <SettlementReconciliation
        demoCase={reconciliationCase}
        onBack={() => setReconciliationCase(null)}
        onPrepareGrievance={() => {
          const current = reconciliationCase;
          setReconciliationCase(null);
          setGrievanceCase(current);
        }}
      />
    );
  }

  if (grievanceCase) {
    return (
      <GrievanceManager
        key={grievanceCase.persona.id}
        demoCase={grievanceCase}
        onBack={() => setGrievanceCase(null)}
      />
    );
  }

  const sessionMsg = view.persisted
    ? view.source === "restored"
      ? locale === "hi"
        ? "रिफ्रेश के बाद सत्र पुनर्स्थापित किया गया।"
        : "Session restored after refresh."
      : locale === "hi"
        ? "रिफ्रेश पुनर्प्राप्ति हेतु सत्र सहेजा गया।"
        : "Session saved for refresh recovery."
    : locale === "hi"
      ? "ब्राउज़र स्टोरेज अवरुद्ध है, इसलिए रिफ्रेश करने पर केस रीसेट हो सकता है।"
      : "Browser storage is blocked, so refresh may reset this case.";

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
      onStartRecovery={
        view.demoCase.persona.id === "imran-returned"
          ? () => setRecoveryCase(view.demoCase)
          : undefined
      }
      onReconcileSettlement={
        view.demoCase.persona.id === "latha-settlement"
          ? () => setReconciliationCase(view.demoCase)
          : undefined
      }
      onPrepareGrievance={() => setGrievanceCase(view.demoCase)}
      onViewTimeline={() => setTimelineCase(view.demoCase)}
      onExplainIssue={() => setInterpreterCase(view.demoCase)}
      sessionMessage={sessionMsg}
      onSwitch={switchCase}
    />
  );
}
