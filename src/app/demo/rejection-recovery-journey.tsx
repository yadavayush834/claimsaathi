"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";
import type { DemoCase } from "@/lib/demo/model";
import type { RecoveryStepId } from "@/lib/demo/recovery-model";
import { recoveryService } from "@/lib/demo/recovery-service";
import { useLocale } from "@/lib/i18n/locale-context";

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
  const { locale } = useLocale();

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
            {locale === "hi"
              ? "सुरक्षित रिजेक्शन सुधार यात्रा · प्राथमिक केस 02"
              : "Safe Rejection Recovery · Primary Case 02"}
          </p>
          <h2 id="recovery-title">
            {locale === "hi"
              ? `${demoCase.persona.displayName} के दावे का सुधार एवं पुनर्प्राप्ति`
              : `Fix & Recover ${demoCase.persona.displayName}'s Claim`}
          </h2>
          <span>
            {locale === "hi"
              ? "बैंक विवरण बेमेल ठीक करने, प्री-फ्लाइट जांच पूरी करने और त्रुटिरहित पुनः सबमिशन के लिए इस 4-चरणीय गाइड का पालन करें।"
              : "Follow this 4-step guided resolution checklist to correct KYC bank proof discrepancies, clear preflight checks, and file a clean mock resubmission."}
          </span>
        </div>
        <Button variant="quiet" onClick={onBack}>
          {locale === "hi" ? "← वर्कस्पेस पर लौटें" : "Back to workspace"}
        </Button>
      </header>

      <Callout
        title={
          locale === "hi"
            ? "सिम्युलेटेड रिजेक्शन सुधार प्रक्रिया"
            : "Simulated Rejection Recovery Flow"
        }
      >
        {locale === "hi"
          ? "यह इंटरैक्टिव विज़ार्ड रिजेक्शन के कारणों का विश्लेषण करता है और पुनः सबमिशन से पहले आवश्यक कार्यों (नागरिक, नियोक्ता, बैंक) का मार्गदर्शन करता है।"
          : "This interactive recovery wizard diagnoses why your claim was returned and guides you through the necessary stakeholder actions (Citizen, Employer, Bank) before launching a verified mock resubmission."}
      </Callout>

      {/* Diagnostic Explanation Card */}
      <section
        className={styles.diagnosticCard}
        aria-labelledby="diagnostic-title"
      >
        <div className={styles.diagnosticHeader}>
          <div>
            <span className={styles.diagnosticEyebrow}>
              {locale === "hi" ? "मूल रिजेक्शन कारण" : "Original Return Reason"}
            </span>
            <h3 id="diagnostic-title" className={styles.diagnosticCode}>
              {plan.categoryLabel}
            </h3>
          </div>
          <StatusBadge tone="critical">
            {locale === "hi" ? "कार्रवाई आवश्यक" : "Action Required"}
          </StatusBadge>
        </div>

        <div className={styles.diagnosticBody}>
          <div className={styles.plainMeaning}>
            <strong>
              {locale === "hi" ? "सरल भाषा में अर्थ: " : "Plain Translation: "}
            </strong>
            <p>{plan.plainLanguageExplanation}</p>
          </div>
          <div className={styles.impact}>
            <strong>
              {locale === "hi" ? "श्रेणी: " : "Original Portal Code: "}
            </strong>
            <p>{plan.rejectionReason}</p>
          </div>
        </div>
      </section>

      {/* Interactive Guided Checklist */}
      <section
        className={styles.checklistSection}
        aria-labelledby="checklist-title"
      >
        <div className={styles.checklistHeader}>
          <div>
            <h3 id="checklist-title">
              {locale === "hi"
                ? "सुधार कार्य चेकलिस्ट"
                : "Guided Resolution Checklist"}
            </h3>
            <span className={styles.checklistProgress} aria-live="polite">
              {completedCount} of {plan.steps.length}{" "}
              {locale === "hi" ? "कदम पूरे हुए" : "steps completed"}
            </span>
          </div>
          <div className={styles.checklistActions}>
            <Button variant="quiet" onClick={handleCompleteAll}>
              {locale === "hi"
                ? "सभी पूरे चिह्नित करें"
                : "Simulate all steps complete"}
            </Button>
            <Button variant="quiet" onClick={handleReset}>
              {locale === "hi" ? "रीसेट करें" : "Reset Steps"}
            </Button>
          </div>
        </div>

        <ol className={styles.checklist}>
          {plan.steps.map((step, index) => (
            <li
              key={step.id}
              className={styles.checklistItem}
              data-completed={step.completed}
            >
              <div className={styles.stepCheckboxWrap}>
                <input
                  type="checkbox"
                  id={`step-${step.id}`}
                  checked={step.completed}
                  onChange={(e) => handleToggleStep(step.id, e.target.checked)}
                  className={styles.stepCheckbox}
                  aria-label={`Mark step ${index + 1}: ${step.title} as completed`}
                />
              </div>
              <div className={styles.stepDetails}>
                <label
                  htmlFor={`step-${step.id}`}
                  className={styles.stepTitleLabel}
                >
                  <span className={styles.stepNumber}>{index + 1}.</span>
                  <strong>{step.title}</strong>
                  <span className={styles.ownerTag}>{step.owner}</span>
                </label>
                <p className={styles.stepDesc}>{step.description}</p>
                {step.officialCitation ? (
                  <small className={styles.etaText}>
                    📜{" "}
                    {locale === "hi" ? "नियम संदर्भ: " : "Official citation: "}
                    {step.officialCitation}
                  </small>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Completion Banner */}
      {allStepsCompleted ? (
        <section
          style={{
            padding: "1rem",
            background: "var(--color-bg-surface-elevated, #f0fdf4)",
            borderRadius: "0.5rem",
            border: "1px solid var(--color-border-success, #86efac)",
            marginTop: "1rem",
          }}
          aria-labelledby="ready-to-submit-heading"
        >
          <h3 id="ready-to-submit-heading" style={{ margin: "0 0 0.5rem 0" }}>
            {locale === "hi"
              ? "त्रुटिरहित नया दावा सबमिट करने हेतु तैयार"
              : "Ready to submit clean mock claim"}
          </h3>
          <p style={{ margin: 0 }}>
            {locale === "hi"
              ? "सभी सुधार कदम पूरे हो चुके हैं। अब आप एक नया दावा प्रस्तुत कर सकते हैं।"
              : "All discrepancy remediation steps verified. You can now launch a clean mock claim resubmission."}
          </p>
        </section>
      ) : null}

      {/* Recovery Status Bar & Next Actions */}
      <div className={styles.actionBar}>
        <div className={styles.actionLeft}>
          <Button variant="secondary" onClick={onOpenPreflight}>
            {locale === "hi"
              ? "केवाईसी प्री-फ्लाइट जांचें चलाएं →"
              : "Open Readiness Preflight Check →"}
          </Button>
          {onViewTimeline ? (
            <Button variant="quiet" onClick={onViewTimeline}>
              {locale === "hi" ? "समयरेखा देखें" : "View Status Timeline"}
            </Button>
          ) : null}
        </div>

        <div className={styles.actionRight}>
          <Button
            disabled={!allStepsCompleted}
            onClick={onStartResubmission}
            className={styles.resubmitBtn}
          >
            {allStepsCompleted
              ? locale === "hi"
                ? "त्रुटिरहित नया दावा सबमिट करें →"
                : "Proceed to clean mock resubmission →"
              : locale === "hi"
                ? `आगे बढ़ने हेतु सभी ${plan.steps.length} कदम पूरे करें`
                : `Complete all ${plan.steps.length} steps to unlock resubmission`}
          </Button>
        </div>
      </div>
    </section>
  );
}
