"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";
import { DemoCase } from "@/lib/demo/model";
import { DemoGrievanceRecord } from "@/lib/demo/grievance-model";
import { grievanceService } from "@/lib/demo/grievance-service";

import styles from "./grievance-manager.module.css";

export interface GrievanceManagerProps {
  readonly demoCase: DemoCase;
  readonly onBack: () => void;
}

export function GrievanceManager({ demoCase, onBack }: GrievanceManagerProps) {
  const [record, setRecord] = useState<DemoGrievanceRecord>(() =>
    grievanceService.getOrInitializeGrievance(demoCase),
  );
  const [copied, setCopied] = useState(false);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = grievanceService.updateSubject(
      demoCase.persona.id,
      e.target.value,
    );
    if (updated) setRecord(updated);
  };

  const handlePetitionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updated = grievanceService.updatePetitionText(
      demoCase.persona.id,
      e.target.value,
    );
    if (updated) setRecord(updated);
  };

  const handleToggleEvidence = (id: string) => {
    const updated = grievanceService.toggleEvidenceAttachment(
      demoCase.persona.id,
      id,
    );
    if (updated) setRecord(updated);
  };

  const handleRegister = () => {
    const updated = grievanceService.registerMockGrievance(demoCase.persona.id);
    if (updated) setRecord(updated);
  };

  const handleToggleReminder = () => {
    const updated = grievanceService.toggleReminder(demoCase.persona.id);
    if (updated) setRecord(updated);
  };

  const handleReset = () => {
    const reset = grievanceService.resetGrievance(demoCase);
    setRecord(reset);
  };

  const handleCopyText = async () => {
    const textToCopy = grievanceService.exportPetitionAsText(record);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownloadText = () => {
    const textToExport = grievanceService.exportPetitionAsText(record);
    const blob = new Blob([textToExport], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Grievance_${record.claimId}_${demoCase.persona.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const attachedCount = record.evidenceList.filter((e) => e.attached).length;
  const isRegistered = record.status === "registered";

  return (
    <section className={styles.manager} aria-labelledby="grievance-title">
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.eyebrow}>
            AI-Assisted Grievance Gateway · EPFiGMS Simulation
          </p>
          <h2 id="grievance-title" className={styles.title}>
            Prepare Grievance for {demoCase.persona.displayName}
          </h2>
          <p className={styles.description}>
            Draft a formal representation citing statutory scheme rules, verify
            required evidence attachments, export for EPFiGMS filing, or
            simulate registration with automated 15-day Citizens&apos; Charter
            SLA tracking.
          </p>
        </div>
        <Button variant="quiet" onClick={onBack}>
          Back to workspace
        </Button>
      </header>

      {isRegistered ? (
        <div
          className={styles.statusBanner}
          role="region"
          aria-label="Grievance Registration Details"
        >
          <div className={styles.statusInfo}>
            <span className={styles.statusDocket}>
              Docket Ref: {record.registrationNumber}
            </span>
            <span className={styles.statusMeta}>
              Filed on 2026-08-29 under EPFO Citizens&apos; Charter 15-Day
              Resolution SLA
            </span>
          </div>
          <div
            style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            <span className={styles.slaTag}>
              ⏱ {record.slaDaysRemaining} Days SLA Target
            </span>
            <Button
              variant={record.reminderActive ? "primary" : "secondary"}
              onClick={handleToggleReminder}
            >
              {record.reminderActive
                ? "✓ SLA Reminder Active"
                : "+ Enable SLA Reminder"}
            </Button>
          </div>
        </div>
      ) : (
        <Callout title="AI-Assisted Formal Petition Ready for Review">
          This draft incorporates statutory citations under EPF Scheme 1952
          (e.g. Para 68 / Para 72) and isolates the specific dispute for the
          Regional P.F. Commissioner. Review, customize, and verify your
          supporting evidence below before filing.
        </Callout>
      )}

      <div className={styles.layoutGrid}>
        {/* Left Column: Editor & Actions */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Formal Representation Petition</h3>
            <StatusBadge tone={isRegistered ? "success" : "info"}>
              {isRegistered ? "Registered" : "Editable Draft"}
            </StatusBadge>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="grievance-subject" className={styles.fieldLabel}>
              Subject Line
            </label>
            <input
              id="grievance-subject"
              className={styles.subjectInput}
              value={record.subject}
              onChange={handleSubjectChange}
              disabled={isRegistered}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="grievance-body" className={styles.fieldLabel}>
              Petition Letter Body (Editable)
            </label>
            <textarea
              id="grievance-body"
              className={styles.petitionTextarea}
              value={record.petitionText}
              onChange={handlePetitionChange}
              disabled={isRegistered}
            />
          </div>

          <div className={styles.editorActions}>
            <Button variant="secondary" onClick={handleCopyText}>
              Copy petition text
            </Button>
            <Button variant="secondary" onClick={handleDownloadText}>
              Export .txt file
            </Button>
            {copied && (
              <span className={styles.copiedToast} role="status">
                ✓ Copied to clipboard!
              </span>
            )}
            {!isRegistered ? (
              <Button variant="primary" onClick={handleRegister}>
                Register on simulated EPFiGMS →
              </Button>
            ) : (
              <Button variant="quiet" onClick={handleReset}>
                Reset to draft
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Evidence & Timeline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-6)",
          }}
        >
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                Supporting Evidence Checklist
              </h3>
              <StatusBadge tone={attachedCount >= 2 ? "success" : "warning"}>
                {`${attachedCount} of ${record.evidenceList.length} Attached`}
              </StatusBadge>
            </div>
            <p
              style={{
                fontSize: "var(--font-size-xs)",
                color: "var(--color-text-muted)",
                margin: 0,
              }}
            >
              Verify and attach supporting documents required for officer
              review.
            </p>

            <ul className={styles.evidenceList}>
              {record.evidenceList.map((item) => (
                <li
                  key={item.id}
                  className={styles.evidenceItem}
                  onClick={() => !isRegistered && handleToggleEvidence(item.id)}
                >
                  <input
                    type="checkbox"
                    className={styles.evidenceCheckbox}
                    checked={item.attached}
                    onChange={() => {}}
                    disabled={isRegistered}
                    aria-label={`Attach ${item.title}`}
                  />
                  <div className={styles.evidenceContent}>
                    <div className={styles.evidenceTitleRow}>
                      <span className={styles.evidenceTitle}>{item.title}</span>
                      {item.required && (
                        <span className={styles.requiredChip}>Required</span>
                      )}
                    </div>
                    <p className={styles.evidenceDesc}>{item.description}</p>
                    {item.attached && item.fileName && (
                      <span className={styles.evidenceFile}>
                        📄 {item.fileName}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Tracking &amp; Charter SLA</h3>
              <StatusBadge tone="info">15-Day Target</StatusBadge>
            </div>
            <p
              style={{
                fontSize: "var(--font-size-xs)",
                color: "var(--color-text-muted)",
                margin: 0,
              }}
            >
              EPFO Citizen&apos;s Charter standard guarantees a response within
              15 working days for grievance dockets.
            </p>

            <ul className={styles.timelineList}>
              {record.events.map((evt) => (
                <li key={evt.id} className={styles.timelineItem}>
                  <span className={styles.timelineDot} />
                  <span className={styles.timelineTitle}>{evt.title}</span>
                  <p className={styles.timelineDesc}>{evt.description}</p>
                  <div className={styles.timelineMeta}>
                    <span>{evt.by}</span>
                    <span>{evt.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
