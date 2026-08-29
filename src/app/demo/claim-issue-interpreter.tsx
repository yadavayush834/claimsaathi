"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  ClaimIssueInterpretation,
  InterpretationResponse,
} from "@/lib/ai/interpreter-model";
import { interpretWithRuleFallback } from "@/lib/ai/rule-fallback-interpreter";
import type { DemoCase } from "@/lib/demo/model";

import styles from "./claim-issue-interpreter.module.css";

type ClaimIssueInterpreterProps = Readonly<{
  demoCase: DemoCase;
  initialRemark?: string;
  onBack: () => void;
  onOpenPreflight?: () => void;
}>;

const PRESET_REMARKS = [
  {
    label: "Bank name mismatch",
    text: "MEMBER NAME IN BANK KYC DOES NOT MATCH WITH UAN RECORD",
  },
  {
    label: "DOB difference > 3 years",
    text: "DATE OF BIRTH MISMATCH (>3 YRS DIFFERENCE). SUBMIT JOINT DECLARATION WITH PROOF",
  },
  {
    label: "Medical certificate missing (Para 68J)",
    text: "MEDICAL CERTIFICATE NOT PRODUCED IN PRESCRIBED FORMAT SIGNED BY RMP (PARA 68J)",
  },
  {
    label: "Service < 5 years (Para 68B)",
    text: "SERVICE LESS THAN 5 YEARS FOR PARA 68B HOUSING ADVANCE",
  },
  {
    label: "Cryptic DA rejection remark",
    text: "CLAIM REJECTED AS PER DA/APFC REMARKS - CONTACT REGIONAL OFFICE",
  },
] as const;

export function ClaimIssueInterpreter({
  demoCase,
  initialRemark,
  onBack,
  onOpenPreflight,
}: ClaimIssueInterpreterProps) {
  const defaultText =
    initialRemark ??
    (demoCase.workspace.issue.tone === "attention"
      ? demoCase.workspace.issue.description
      : PRESET_REMARKS[0].text);

  const [remarkText, setRemarkText] = useState(defaultText);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interpretation, setInterpretation] =
    useState<ClaimIssueInterpretation | null>(() =>
      interpretWithRuleFallback({
        rawStatusText: defaultText,
        context: {
          personaId: demoCase.persona.id,
          requestedAmountRupees: demoCase.claim.requestedAmountRupees,
        },
      }),
    );
  const [copied, setCopied] = useState(false);

  async function handleAnalyze() {
    const query = remarkText.trim();
    if (!query) {
      setError("Please enter or select a portal remark to analyze.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload = {
      rawStatusText: query,
      context: {
        personaId: demoCase.persona.id,
        claimType: "PF Advance",
        requestedAmountRupees: demoCase.claim.requestedAmountRupees,
      },
    };

    try {
      let result: InterpretationResponse;
      try {
        const response = await fetch("/api/demo/interpret-issue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        result = (await response.json()) as InterpretationResponse;
      } catch {
        result = {
          ok: true,
          interpretation: interpretWithRuleFallback(payload),
        };
      }

      if (result.ok) {
        setInterpretation(result.interpretation);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Interpretation analysis failed.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function copyActionSummary() {
    if (!interpretation) return;
    const summary = [
      `ClaimSaathi Issue Diagnostic Summary`,
      `Issue: ${interpretation.categoryLabel}`,
      `Severity: ${interpretation.severity}`,
      `Plain Language Explanation: ${interpretation.plainLanguageExplanation}`,
      `Root Cause: ${interpretation.rootCause}`,
      `Action Steps:`,
      ...interpretation.citedNextSteps.map(
        (s) =>
          `  ${s.order}. [${s.owner}] ${s.step} (Ref: ${s.officialRuleCitation})`,
      ),
      `Diagnostic Engine: ${interpretation.modelUsed} (Synthetic)`,
    ].join("\n");

    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <section className={styles.container} aria-labelledby="interpreter-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            AI Civic Diagnostic · EPFO Portal Remark Translation
          </p>
          <h2 id="interpreter-title">Claim Issue & Rejection Interpreter</h2>
          <span>
            Translates cryptic EPFO rejection remarks into plain-language
            diagnostics with cited official regulations and designated action
            owners.
          </span>
        </div>
        <Button variant="quiet" onClick={onBack}>
          Back to workspace
        </Button>
      </header>

      <Callout title="Simulated AI Civic Assistant">
        This tool translates unstructured portal remarks using structured AI and
        deterministic civic rulebooks. It does not access private passwords,
        Aadhaar OTPs, or EPFO internal servers.
      </Callout>

      {/* Input & Presets Section */}
      <section className={styles.inputCard} aria-labelledby="input-card-title">
        <h3 id="input-card-title">Select or paste a portal remark</h3>
        <p className={styles.inputHint}>
          Choose a common Indian EPFO rejection remark below, or paste any
          status text from your portal SMS or claim tracking page:
        </p>

        <div
          className={styles.presetsBar}
          role="group"
          aria-label="Preset remarks"
        >
          {PRESET_REMARKS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className={styles.presetChip}
              data-active={remarkText === preset.text}
              onClick={() => {
                setRemarkText(preset.text);
                setError(null);
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className={styles.textInputWrap}>
          <label htmlFor="raw-remark-input" className={styles.inputLabel}>
            Portal status or rejection text:
          </label>
          <textarea
            id="raw-remark-input"
            className={styles.textarea}
            rows={3}
            value={remarkText}
            onChange={(e) => {
              setRemarkText(e.target.value);
              setError(null);
            }}
            placeholder="e.g. MEMBER NAME IN BANK KYC DOES NOT MATCH WITH UAN RECORD"
          />
        </div>

        {error ? <p className={styles.errorMessage}>{error}</p> : null}

        <div className={styles.inputActions}>
          <Button onClick={handleAnalyze} disabled={isLoading}>
            {isLoading ? "Analyzing with AI…" : "Translate & Analyze Issue →"}
          </Button>
        </div>
      </section>

      {/* Results Diagnostic Panel */}
      {interpretation ? (
        <section
          className={styles.resultsCard}
          aria-labelledby="results-title"
          aria-live="polite"
        >
          <div className={styles.resultsHeader}>
            <div>
              <div className={styles.badgeRow}>
                <StatusBadge
                  tone={
                    interpretation.severity === "blocker"
                      ? "critical"
                      : interpretation.severity === "warning"
                        ? "warning"
                        : "info"
                  }
                >
                  {interpretation.severity === "blocker"
                    ? "Blocker / Action required"
                    : interpretation.severity === "warning"
                      ? "Needs review"
                      : "Informational note"}
                </StatusBadge>
                <span className={styles.modelChip}>
                  Engine: <strong>{interpretation.modelUsed}</strong>
                </span>
                <span className={styles.confidenceChip}>
                  Confidence: {interpretation.confidence}
                </span>
              </div>
              <h3 id="results-title">{interpretation.categoryLabel}</h3>
            </div>
            <Button variant="secondary" onClick={copyActionSummary}>
              {copied ? "✓ Copied checklist" : "Copy action summary"}
            </Button>
          </div>

          <div className={styles.explanationBox}>
            <strong>What this means in plain language</strong>
            <p>{interpretation.plainLanguageExplanation}</p>
          </div>

          <div className={styles.rootCauseBox}>
            <span>Identified root cause</span>
            <p>{interpretation.rootCause}</p>
          </div>

          {/* Action Checklist with Designated Owners */}
          <div className={styles.stepsSection}>
            <h4>Step-by-step action checklist</h4>
            <ol className={styles.stepsList}>
              {interpretation.citedNextSteps.map((step) => (
                <li key={step.order} className={styles.stepCard}>
                  <div className={styles.stepNumber} aria-hidden="true">
                    {step.order}
                  </div>
                  <div className={styles.stepBody}>
                    <div className={styles.stepMetaRow}>
                      <span className={styles.ownerBadge}>
                        Action Owner: <strong>{step.owner}</strong>
                      </span>
                      <span className={styles.citationBadge}>
                        Citation: {step.officialRuleCitation}
                      </span>
                    </div>
                    <p className={styles.stepText}>{step.step}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {interpretation.suggestedGrievanceNote ? (
            <div className={styles.grievanceDraftBox}>
              <strong>Suggested EPFiGMS appeal / clarification text</strong>
              <p>{interpretation.suggestedGrievanceNote}</p>
            </div>
          ) : null}

          <div className={styles.resultsFooter}>
            {onOpenPreflight ? (
              <Button onClick={onOpenPreflight}>
                Check readiness preflight checklist →
              </Button>
            ) : null}
            <Button variant="secondary" onClick={onBack}>
              Return to workspace
            </Button>
          </div>
        </section>
      ) : null}
    </section>
  );
}
