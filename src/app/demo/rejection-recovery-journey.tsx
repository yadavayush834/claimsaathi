"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";
import type { DemoCase } from "@/lib/demo/model";
import type { RecoveryStepId } from "@/lib/demo/recovery-model";
import { recoveryService } from "@/lib/demo/recovery-service";

import styles from "./rejection-recovery-journey.module.css";

type RejectionRecoveryJourneyProps = Readonly<{
  demoCase: DemoCase;
  onBack: () => void;
  onOpenPreflight: () => void;
  onStartResubmission: () => void;
  onViewTimeline?: () => void;
}>;

export function RejectionRecoveryJourney({
  demoCase,
  onBack,
  onOpenPreflight,
  onStartResubmission,
  onViewTimeline,
}: RejectionRecoveryJourneyProps) {
  const [plan, setPlan] = useState(() =>
    recoveryService.getRecoveryPlan(demoCase.persona.id),
  );

  const allStepsCompleted = useMemo(
    () => plan.steps.every((s) => s.completed),
    [plan.steps],
  );

  const completedCount = useMemo(
    () => plan.steps.filter((s) => s.completed).length,
    [plan.steps],
  );

  function handleToggleStep(stepId: RecoveryStepId, completed: boolean) {
    const updated = recoveryService.toggleRecoveryStep(
      demoCase.persona.id,
      stepId,
      completed,
    );
    setPlan(updated);
  }

  function handleCompleteAll() {
    const updated = recoveryService.markAllRecoveryStepsComplete(
      demoCase.persona.id,
    );
    setPlan(updated);
  }

  function handleReset() {
    const reset = recoveryService.resetRecoveryPlan(demoCase.persona.id);
    setPlan(reset);
  }

  return (
    <section className={styles.container} aria-labelledby="recovery-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            Safe Rejection Recovery · Primary Case 02
          </p>
          <h2 id="recovery-title">
            Fix & Recover {demoCase.persona.displayName}&apos;s Claim
          </h2>
          <span>
            Follow this 4-step guided resolution checklist to correct KYC bank
            proof discrepancies, clear preflight checks, and file a clean mock
            resubmission.
          </span>
        </div>
        <Button variant="quiet" onClick={onBack}>
          Back to workspace
        </Button>
      </header>

      <Callout title="Simulated Rejection Recovery Flow">
        This interactive recovery wizard diagnoses why your claim was returned
        and guides you through the necessary stakeholder actions (Citizen,
        Employer, Bank) before launching a verified mock resubmission.
      </Callout>

      {/* Diagnostic Explanation Card */}
      <section
        className={styles.diagnosticCard}
        aria-labelledby="diagnostic-title"
      >
        <div className={styles.diagnosticHeader}>
          <div>
            <span className={styles.diagnosticEyebrow}>
              Original Return Reason
            </span>
            <h3 id="diagnostic-title">{plan.categoryLabel}</h3>
          </div>
          <StatusBadge tone={plan.resubmitted ? "success" : "warning"}>
            {plan.resubmitted
              ? "Clean mock resubmitted"
              : allStepsCompleted
                ? "Ready for resubmission"
                : "Action required"}
          </StatusBadge>
        </div>

        <div className={styles.remarkBox}>
          <strong>EPFO Portal Return Remark:</strong>
          <p className={styles.remarkQuote}>
            &ldquo;{plan.rejectionReason}&rdquo;
          </p>
        </div>

        <div className={styles.explanationBox}>
          <strong>What happened in plain language:</strong>
          <p>{plan.plainLanguageExplanation}</p>
        </div>
      </section>

      {/* Interactive Correction Checklist */}
      <section
        className={styles.checklistCard}
        aria-labelledby="checklist-title"
      >
        <div className={styles.checklistHeader}>
          <div>
            <h3 id="checklist-title">
              Correction & Verification Checklist ({completedCount}/
              {plan.steps.length})
            </h3>
            <p className={styles.checklistSubtitle}>
              Check off each action as it is completed in the simulated
              workflow:
            </p>
          </div>
          <div className={styles.quickActions}>
            <Button
              variant="secondary"
              onClick={handleCompleteAll}
              disabled={allStepsCompleted}
            >
              Simulate all steps complete
            </Button>
            <Button variant="quiet" onClick={handleReset}>
              Reset checklist
            </Button>
          </div>
        </div>

        <ol className={styles.stepList}>
          {plan.steps.map((step, index) => (
            <li
              key={step.id}
              className={styles.stepItem}
              data-completed={step.completed}
            >
              <label className={styles.stepLabel} htmlFor={`step-${step.id}`}>
                <input
                  id={`step-${step.id}`}
                  type="checkbox"
                  className={styles.checkbox}
                  checked={step.completed}
                  onChange={(e) => handleToggleStep(step.id, e.target.checked)}
                />
                <div className={styles.stepContent}>
                  <div className={styles.stepMetaRow}>
                    <span className={styles.stepIndex}>Step {index + 1}</span>
                    <span className={styles.ownerBadge}>
                      Action Owner: <strong>{step.owner}</strong>
                    </span>
                    <span className={styles.citationBadge}>
                      {step.officialCitation}
                    </span>
                  </div>
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                </div>
              </label>
            </li>
          ))}
        </ol>
      </section>

      {/* Preflight & Resubmission Gateway */}
      <section className={styles.gatewayCard} aria-labelledby="gateway-title">
        <h3 id="gateway-title">Next Step: Verification & Resubmission</h3>

        {plan.resubmitted ? (
          <div className={styles.resubmittedBox}>
            <StatusBadge tone="success">✓ Resubmission Recorded</StatusBadge>
            <h4>Clean Mock Claim Filed Successfully!</h4>
            <p>
              Your corrected claim (ID:{" "}
              <strong>{plan.resubmittedClaimId ?? "DEMO-CLM-REC-9001"}</strong>)
              has been submitted with verified bank records.
            </p>
            {onViewTimeline ? (
              <Button onClick={onViewTimeline}>
                Track claim on timeline →
              </Button>
            ) : (
              <Button variant="secondary" onClick={onBack}>
                Return to workspace
              </Button>
            )}
          </div>
        ) : allStepsCompleted ? (
          <div className={styles.readyBox}>
            <StatusBadge tone="success">
              ✓ All Correction Checks Verified
            </StatusBadge>
            <h4>Ready to submit clean mock claim</h4>
            <p>
              Bank records and preflight verification are now green. You can
              proceed to file the corrected mock application without risk of
              name mismatch return.
            </p>
            <div className={styles.readyActions}>
              <Button onClick={onStartResubmission}>
                Proceed to clean mock resubmission →
              </Button>
              <Button variant="secondary" onClick={onOpenPreflight}>
                Recheck preflight details
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.pendingBox}>
            <p>
              Please complete all {plan.steps.length} checklist steps above or
              run the readiness preflight check before resubmitting.
            </p>
            <div className={styles.pendingActions}>
              <Button variant="secondary" onClick={onOpenPreflight}>
                Open Readiness Preflight Check →
              </Button>
              <Button variant="quiet" onClick={onBack}>
                Cancel recovery
              </Button>
            </div>
          </div>
        )}
      </section>
    </section>
  );
}
