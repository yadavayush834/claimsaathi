"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { DemoCase } from "@/lib/demo/model";
import type {
  ReconciliationResolutionStatus,
  SettlementReconciliationReport,
} from "@/lib/demo/reconciliation-model";
import { reconciliationService } from "@/lib/demo/reconciliation-service";
import { useLocale } from "@/lib/i18n/locale-context";

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
  const { locale } = useLocale();

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
            {locale === "hi"
              ? `काल्पनिक निपटान मिलान · दावा ${report.claimId}`
              : `Synthetic Settlement Reconciliation · Claim ${report.claimId}`}
          </p>
          <h2 id="reconciliation-title" className={styles.title}>
            {locale === "hi"
              ? `${demoCase.persona.displayName} के निपटान का मिलान करें`
              : `Reconcile ${demoCase.persona.displayName}'s Settled Claim`}
          </h2>
          <p className={styles.description}>
            {locale === "hi"
              ? "मांगी गई, कानूनी रूप से पात्र और वास्तव में प्राप्त राशि की तुलना करें और सरकारी नियमों के तहत कटौतियों को समझें।"
              : "Compare requested, statutory eligible, and settled mock amounts side by side with clear separation of confirmed disbursement facts and scheme rules."}
          </p>
        </div>
        <Button variant="quiet" onClick={onBack}>
          {locale === "hi" ? "← वर्कस्पेस पर लौटें" : "Back to workspace"}
        </Button>
      </header>

      {/* 3-Card Summary Grid */}
      <div className={styles.summaryGrid}>
        <article
          className={styles.summaryCard}
          aria-labelledby="card-requested"
        >
          <span id="card-requested" className={styles.summaryCardLabel}>
            {locale === "hi"
              ? "1. मांगी गई अग्रिम राशि"
              : "1. Requested Advance"}
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
            {locale === "hi"
              ? "2. कानूनी पात्र सीमा (Cap)"
              : "2. Statutory Eligible Cap"}
          </span>
          <strong className={styles.summaryCardAmount}>
            {formatCurrency(report.eligibleAmountRupees)}
          </strong>
          <span className={styles.summaryCardSubtext}>
            {locale === "hi" ? "ईपीएफ योजना सीमा" : "EPF Scheme Cap"}
          </span>
        </article>

        <article
          className={styles.summaryCard}
          data-highlight="disbursed"
          aria-labelledby="card-settled"
        >
          <span id="card-settled" className={styles.summaryCardLabel}>
            {locale === "hi"
              ? "3. वास्तविक संवितरित राशि"
              : "3. Actually Disbursed"}
          </span>
          <strong className={styles.summaryCardAmount}>
            {formatCurrency(report.settledAmountRupees)}
          </strong>
          <span className={styles.summaryCardSubtext}>
            {locale === "hi"
              ? `अंतर: ${formatCurrency(report.varianceRupees)}`
              : `Shortfall: ${formatCurrency(report.varianceRupees)}`}
          </span>
        </article>
      </div>

      {/* Verified Facts Ledger */}
      <section className={styles.factsSection} aria-labelledby="facts-heading">
        <div className={styles.sectionHeader}>
          <h3 id="facts-heading">
            {locale === "hi" ? "सत्यापित तथ्य खाता" : "Verified Facts Ledger"}
          </h3>
          <span className={styles.sectionHint}>
            {locale === "hi"
              ? "काल्पनिक खाता बही विवरण"
              : "Disbursement facts from synthetic fixture"}
          </span>
        </div>

        <dl className={styles.factsList}>
          {report.confirmedFacts.map((fact) => (
            <div key={fact.id} className={styles.factRow}>
              <dt className={styles.factLabel}>
                <strong>{fact.label}</strong>
                <span className={styles.factNote}>{fact.source}</span>
              </dt>
              <dd className={styles.factValue}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Statutory Deductions Explanation */}
      <section
        className={styles.deductionsSection}
        aria-labelledby="deductions-heading"
      >
        <div className={styles.sectionHeader}>
          <h3 id="deductions-heading">
            {locale === "hi"
              ? "कटौतियों का कानूनी विश्लेषण"
              : "Statutory Deductions & Cap Analysis"}
          </h3>
        </div>

        <ul className={styles.deductionsList}>
          {report.deductionsAndFactors.map((d) => (
            <li key={d.id} className={styles.deductionItem}>
              <div className={styles.deductionHeader}>
                <strong>{d.title}</strong>
                <span className={styles.deductionAmount}>
                  -{formatCurrency(d.amountRupees)}
                </span>
              </div>
              <p className={styles.deductionRule}>
                {locale === "hi" ? "नियम: " : "Rule: "}
                {d.ruleCitation}
              </p>
              <p className={styles.deductionExplain}>{d.explanation}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Resolution State Actions */}
      <section
        className={styles.resolutionSection}
        aria-labelledby="resolution-heading"
      >
        <div className={styles.sectionHeader}>
          <h3 id="resolution-heading">
            {locale === "hi" ? "समाधान की स्थिति" : "Reconciliation Resolution"}
          </h3>
          <StatusBadge
            tone={
              report.resolutionStatus === "accepted_statutory"
                ? "success"
                : report.resolutionStatus === "disputed_for_grievance"
                  ? "critical"
                  : "warning"
            }
          >
            {report.resolutionStatus === "accepted_statutory"
              ? locale === "hi"
                ? "निपटान स्वीकार किया गया"
                : "Settlement Accepted"
              : report.resolutionStatus === "disputed_for_grievance"
                ? locale === "hi"
                  ? "शिकायत दर्ज (Disputed)"
                  : "Disputed / Grievance"
                : locale === "hi"
                  ? "समीक्षाधीन"
                  : "Under Review"}
          </StatusBadge>
        </div>

        <div className={styles.resolutionButtons}>
          <Button
            variant={
              report.resolutionStatus === "accepted_statutory"
                ? "primary"
                : "secondary"
            }
            onClick={() => handleSetStatus("accepted_statutory")}
          >
            {locale === "hi"
              ? "✓ कटौती समझी गई व स्वीकार की गई"
              : "✓ Accept Reconciled Amount"}
          </Button>

          {onPrepareGrievance ? (
            <Button
              variant={
                report.resolutionStatus === "disputed_for_grievance"
                  ? "primary"
                  : "secondary"
              }
              onClick={() => {
                handleSetStatus("disputed_for_grievance");
                onPrepareGrievance();
              }}
            >
              {locale === "hi"
                ? "शिकायत (Grievance) दर्ज करें →"
                : "Dispute via Grievance →"}
            </Button>
          ) : null}

          <Button variant="quiet" onClick={handleReset}>
            {locale === "hi" ? "रीसेट करें" : "Reset Resolution"}
          </Button>
        </div>
      </section>
    </section>
  );
}
