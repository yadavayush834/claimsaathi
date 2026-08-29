"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";
import type { DemoCase } from "@/lib/demo/model";
import type {
  ReconciliationResolutionStatus,
  SettlementReconciliationReport,
} from "@/lib/demo/reconciliation-model";
import { reconciliationService } from "@/lib/demo/reconciliation-service";

import styles from "./settlement-reconciliation.module.css";

type SettlementReconciliationProps = Readonly<{
  demoCase: DemoCase;
  onBack: () => void;
  onPrepareGrievance?: () => void;
}>;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SettlementReconciliation({
  demoCase,
  onBack,
  onPrepareGrievance,
}: SettlementReconciliationProps) {
  const [report, setReport] = useState<SettlementReconciliationReport>(() =>
    reconciliationService.getReconciliationReport(demoCase.persona.id),
  );

  function handleSetStatus(status: ReconciliationResolutionStatus) {
    const updated = reconciliationService.updateResolutionStatus(
      demoCase.persona.id,
      status,
    );
    setReport(updated);
  }

  function handleReset() {
    const reset = reconciliationService.resetReconciliation(
      demoCase.persona.id,
    );
    setReport(reset);
  }

  return (
    <section
      className={styles.reconciliation}
      aria-labelledby="reconciliation-title"
    >
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.eyebrow}>
            Synthetic Settlement Reconciliation · Claim {report.claimId}
          </p>
          <h2 id="reconciliation-title" className={styles.title}>
            Reconcile {demoCase.persona.displayName}&apos;s Settled Claim
          </h2>
          <p className={styles.description}>
            Compare requested, statutory eligible, and settled mock amounts side
            by side with clear separation of confirmed disbursement facts and
            scheme rules.
          </p>
        </div>
        <Button variant="quiet" onClick={onBack}>
          Back to workspace
        </Button>
      </header>

      {/* 3-Card Summary Grid */}
      <div className={styles.summaryGrid}>
        <article
          className={styles.summaryCard}
          aria-labelledby="card-requested"
        >
          <span id="card-requested" className={styles.summaryCardLabel}>
            1. Requested Advance
          </span>
          <strong className={styles.summaryCardAmount}>
            {formatCurrency(report.requestedAmountRupees)}
          </strong>
          <span className={styles.summaryCardSubtext}>{report.claimType}</span>
        </article>

        <article
          className={styles.summaryCard}
          data-highlight="variance"
          aria-labelledby="card-eligible"
        >
          <span id="card-eligible" className={styles.summaryCardLabel}>
            2. Statutory Eligible Cap
          </span>
          <strong className={styles.summaryCardAmount}>
            {formatCurrency(report.eligibleAmountRupees)}
          </strong>
          <span className={styles.summaryCardSubtext}>
            24× monthly basic wage + DA ceiling rule
          </span>
        </article>

        <article
          className={styles.summaryCard}
          data-highlight="settled"
          aria-labelledby="card-settled"
        >
          <span id="card-settled" className={styles.summaryCardLabel}>
            3. Settled & Disbursed
          </span>
          <strong className={styles.summaryCardAmount}>
            {formatCurrency(report.settledAmountRupees)}
          </strong>
          <span className={styles.summaryCardSubtext}>
            Credited on {report.disbursementDate} to{" "}
            {report.disbursedBankMasked}
          </span>
        </article>
      </div>

      {/* Callout on Amount Variance */}
      {report.varianceRupees > 0 ? (
        <Callout
          title={`Total Amount Variance: ${formatCurrency(report.varianceRupees)}`}
        >
          The difference of {formatCurrency(report.varianceRupees)} between the
          initial requested amount (
          {formatCurrency(report.requestedAmountRupees)}) and the disbursed
          settlement ({formatCurrency(report.settledAmountRupees)}) is 100%
          accounted for by statutory EPFO wage-ceiling limits under Para 68B.
        </Callout>
      ) : null}

      {/* Main Analysis Sections */}
      <div className={styles.sectionGrid}>
        {/* Confirmed Facts Ledger */}
        <section
          className={styles.card}
          aria-labelledby="confirmed-facts-title"
        >
          <div className={styles.cardHeader}>
            <h3 id="confirmed-facts-title" className={styles.cardTitle}>
              Confirmed Facts on Record
            </h3>
            <StatusBadge tone="success">
              {report.confirmedFacts.length} Verified
            </StatusBadge>
          </div>

          <ul className={styles.factsList}>
            {report.confirmedFacts.map((fact) => (
              <li key={fact.id} className={styles.factItem}>
                <div className={styles.factTopRow}>
                  <span className={styles.factLabel}>{fact.label}</span>
                  <span className={styles.sourceBadge}>{fact.source}</span>
                </div>
                <strong className={styles.factValue}>{fact.value}</strong>
              </li>
            ))}
          </ul>
        </section>

        {/* Statutory Factors & Deductions */}
        <section className={styles.card} aria-labelledby="factors-title">
          <div className={styles.cardHeader}>
            <h3 id="factors-title" className={styles.cardTitle}>
              Statutory Deductions & Factor Analysis
            </h3>
            <StatusBadge tone="info">Rule Breakdown</StatusBadge>
          </div>

          <ul className={styles.deductionList}>
            {report.deductionsAndFactors.map((item) => (
              <li key={item.id} className={styles.deductionItem}>
                <div className={styles.deductionHeader}>
                  <strong className={styles.deductionTitle}>
                    {item.title}
                  </strong>
                  {item.amountRupees > 0 ? (
                    <span className={styles.deductionAmount}>
                      -{formatCurrency(item.amountRupees)}
                    </span>
                  ) : (
                    <span className={styles.deductionAmount}>
                      ₹0 (Eligible)
                    </span>
                  )}
                </div>
                <span className={styles.citationTag}>{item.ruleCitation}</span>
                <p className={styles.deductionExplanation}>
                  {item.explanation}
                </p>
              </li>
            ))}
          </ul>

          <div className={styles.unexplainedBox}>
            <span>✓</span>
            <strong>
              Unexplained Discrepancies:{" "}
              {formatCurrency(report.unexplainedShortfallRupees)}
            </strong>
            <span>(No missing or unauthorized deductions found)</span>
          </div>
        </section>
      </div>

      {/* Resolution Actions Card */}
      <section
        className={styles.resolutionCard}
        aria-labelledby="resolution-title"
      >
        <h3 id="resolution-title" className={styles.resolutionTitle}>
          Settlement Reconciliation Resolution
        </h3>

        {report.resolutionStatus === "under_review" ? (
          <>
            <p className={styles.resolutionText}>
              Do you accept the statutory 24-month wage limit explanation, or do
              you want to raise a discrepancy dispute for grievance filing?
            </p>
            <div className={styles.resolutionActions}>
              <Button
                variant="primary"
                onClick={() => handleSetStatus("accepted_statutory")}
              >
                I understand the statutory ceiling — Mark Reconciled
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  handleSetStatus("disputed_for_grievance");
                  if (onPrepareGrievance) {
                    onPrepareGrievance();
                  }
                }}
              >
                Dispute calculation — Prepare Grievance →
              </Button>
            </div>
          </>
        ) : report.resolutionStatus === "accepted_statutory" ? (
          <div className={styles.stateCallout} data-status="accepted_statutory">
            <div>
              <strong>Reconciliation Complete</strong>
              <p className={styles.resolutionText}>
                You confirmed understanding of the statutory 24-month wage cap.
                Settlement is marked as fully reconciled.
              </p>
            </div>
            <Button variant="quiet" onClick={handleReset}>
              Reset decision
            </Button>
          </div>
        ) : (
          <div
            className={styles.stateCallout}
            data-status="disputed_for_grievance"
          >
            <div>
              <strong>Discrepancy Flagged for Grievance</strong>
              <p className={styles.resolutionText}>
                The ₹18,000 difference has been flagged. You can prepare an
                AI-assisted grievance petition with cited evidence.
              </p>
            </div>
            <div className={styles.resolutionActions}>
              {onPrepareGrievance ? (
                <Button variant="primary" onClick={onPrepareGrievance}>
                  Continue to Grievance Preparation →
                </Button>
              ) : null}
              <Button variant="quiet" onClick={handleReset}>
                Reset decision
              </Button>
            </div>
          </div>
        )}
      </section>
    </section>
  );
}
