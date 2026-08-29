"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  DemoCase,
  DemoPreflightCategory,
  DemoPreflightCheck,
} from "@/lib/demo/model";
import { runDemoPreflight } from "@/lib/preflight/demo-preflight";

import styles from "./kyc-preflight.module.css";

type KycPreflightProps = Readonly<{
  demoCase: DemoCase;
  onBack: () => void;
}>;

const categoryLabels: Record<DemoPreflightCategory, string> = {
  identity: "Identity",
  bank: "Bank",
  evidence: "Evidence",
};

function getEffectiveStatus(
  check: DemoPreflightCheck,
  resolvedIds: Set<string>,
) {
  return resolvedIds.has(check.id) ? "ready" : check.status;
}

export function KycPreflight({ demoCase, onBack }: KycPreflightProps) {
  const preflight = useMemo(
    () => runDemoPreflight(demoCase.workspace.preflight),
    [demoCase.workspace.preflight],
  );
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(() => new Set());
  const firstActionCheck = preflight.checks.find(
    (check) => check.status === "action_needed",
  );
  const [selectedCheckId, setSelectedCheckId] = useState(
    firstActionCheck?.id ?? preflight.checks[0]?.id ?? "",
  );
  const [isConfirmed, setIsConfirmed] = useState(false);

  const effectiveChecks = preflight.checks.map((check) => ({
    check,
    status: getEffectiveStatus(check, resolvedIds),
  }));
  const remainingChecks = effectiveChecks.filter(
    ({ status }) => status === "action_needed",
  );
  const selected =
    effectiveChecks.find(({ check }) => check.id === selectedCheckId) ??
    effectiveChecks[0];

  function selectCheck(checkId: string) {
    setSelectedCheckId(checkId);
    setIsConfirmed(false);
  }

  function markSelectedReady() {
    if (!selected || selected.status !== "action_needed" || !isConfirmed) {
      return;
    }

    const nextResolved = new Set(resolvedIds);
    nextResolved.add(selected.check.id);
    setResolvedIds(nextResolved);
    setIsConfirmed(false);

    const nextAction = effectiveChecks.find(
      ({ check, status }) =>
        check.id !== selected.check.id && status === "action_needed",
    );

    if (nextAction) {
      setSelectedCheckId(nextAction.check.id);
    }
  }

  const completedCount = effectiveChecks.length - remainingChecks.length;
  const isComplete = remainingChecks.length === 0;
  const selectedWasResolved = Boolean(
    selected && resolvedIds.has(selected.check.id),
  );

  return (
    <section className={styles.preflight} aria-labelledby="preflight-title">
      <header className={styles.header}>
        <div>
          <p>Fictional readiness preflight · no submission</p>
          <h2 id="preflight-title">Check what needs fixing first</h2>
          <span>{demoCase.persona.displayName}&apos;s synthetic case</span>
        </div>
        <Button variant="quiet" onClick={onBack}>
          Back to workspace
        </Button>
      </header>

      <Callout title="Synthetic records only">
        These comparisons use local fictional records. Do not enter, upload, or
        correct real identity, bank, or medical information here.
      </Callout>

      <section className={styles.summary} aria-labelledby="preflight-summary">
        <div className={styles.summaryNumber} aria-hidden="true">
          <span>{isComplete ? "✓" : remainingChecks.length}</span>
          <small>{isComplete ? "ready" : "to fix"}</small>
        </div>
        <div>
          <p>Preflight result</p>
          <h3 id="preflight-summary">
            {isComplete
              ? "This fictional case is ready for its next step."
              : `${remainingChecks.length} fictional records need attention.`}
          </h3>
          <span>
            {completedCount} of {effectiveChecks.length} readiness checks are
            clear in this browser.
          </span>
        </div>
        <div className={styles.summaryMeter} aria-label="Preflight progress">
          <span
            style={{
              width: `${(completedCount / effectiveChecks.length) * 100}%`,
            }}
          />
        </div>
      </section>

      <div className={styles.preflightGrid}>
        <nav className={styles.checkRail} aria-label="Readiness checks">
          <div className={styles.railHeading}>
            <p>Check records</p>
            <span>Choose one to review</span>
          </div>
          <ol>
            {effectiveChecks.map(({ check, status }, index) => (
              <li key={check.id} data-status={status}>
                <button
                  type="button"
                  aria-current={
                    selected?.check.id === check.id ? "step" : undefined
                  }
                  aria-label={`Review ${categoryLabels[check.category]}: ${check.label}`}
                  onClick={() => selectCheck(check.id)}
                >
                  <span className={styles.checkNumber} aria-hidden="true">
                    {status === "ready"
                      ? "✓"
                      : String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <small>{categoryLabels[check.category]}</small>
                    <strong>{check.label}</strong>
                  </span>
                  <StatusBadge
                    tone={status === "ready" ? "success" : "critical"}
                  >
                    {status === "ready" ? "Clear" : "Fix"}
                  </StatusBadge>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {selected ? (
          <section
            className={styles.reviewPanel}
            data-status={selected.status}
            aria-labelledby="selected-check-title"
          >
            <header className={styles.reviewHeader}>
              <div>
                <p>{categoryLabels[selected.check.category]} record</p>
                <h3 id="selected-check-title">{selected.check.label}</h3>
              </div>
              <StatusBadge
                tone={selected.status === "ready" ? "success" : "critical"}
              >
                {selected.status === "ready"
                  ? "Ready in demo"
                  : "Action needed"}
              </StatusBadge>
            </header>

            <p className={styles.reviewSummary}>
              {selectedWasResolved
                ? "You marked this fictional correction ready in this browser. The original comparison remains below for context."
                : selected.check.summary}
            </p>

            <section
              className={styles.comparison}
              aria-labelledby="comparison-title"
            >
              <p id="comparison-title">What the fictional check compared</p>
              <dl>
                {selected.check.comparedRecords.map((record) => (
                  <div key={record.label}>
                    <dt>{record.label}</dt>
                    <dd>{record.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {selected.status === "action_needed" ? (
              <section
                className={styles.correction}
                aria-labelledby="owner-title"
              >
                <div className={styles.ownerLine}>
                  <div>
                    <p id="owner-title">Who can fix this</p>
                    <strong>{selected.check.ownerLabel}</strong>
                  </div>
                  <span aria-hidden="true">→</span>
                </div>
                <h4>{selected.check.actionLabel}</h4>
                <ol>
                  {selected.check.correctionSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <label className={styles.confirmation}>
                  <input
                    type="checkbox"
                    checked={isConfirmed}
                    onChange={(event) => setIsConfirmed(event.target.checked)}
                  />
                  <span>
                    I completed these fictional correction steps for this demo.
                  </span>
                </label>
                <Button disabled={!isConfirmed} onClick={markSelectedReady}>
                  Mark this check ready
                </Button>
              </section>
            ) : (
              <div className={styles.clearPanel}>
                <span aria-hidden="true">✓</span>
                <div>
                  <strong>No correction is needed in this demo.</strong>
                  <p>
                    This local status reflects the simulated correction; it does
                    not alter the fictional source records shown above.
                  </p>
                </div>
              </div>
            )}
          </section>
        ) : null}
      </div>

      {isComplete ? (
        <section className={styles.complete} aria-live="polite">
          <span aria-hidden="true">✓</span>
          <div>
            <p>Preflight complete</p>
            <h3>All three fictional readiness checks are clear.</h3>
            <span>
              The next mock claim form is intentionally not available until a
              later phase of this prototype.
            </span>
          </div>
          <Button variant="secondary" onClick={onBack}>
            Return to workspace
          </Button>
        </section>
      ) : null}
    </section>
  );
}
