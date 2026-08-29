"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";
import { DemoCase } from "@/lib/demo/model";
import { DemoGrievanceRecord } from "@/lib/demo/grievance-model";
import { grievanceService } from "@/lib/demo/grievance-service";
import { useLocale } from "@/lib/i18n/locale-context";

import styles from "./grievance-manager.module.css";

export interface GrievanceManagerProps {
  readonly demoCase: DemoCase;
  readonly onBack: () => void;
}

export function GrievanceManager({ demoCase, onBack }: GrievanceManagerProps) {
  const { locale, t } = useLocale();

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
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(textToCopy);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
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
            {locale === "hi"
              ? "एआई-सहायक शिकायत पोर्टल · EPFiGMS सिमुलेशन"
              : "AI-Assisted Grievance Gateway · EPFiGMS Simulation"}
          </p>
          <h2 id="grievance-title" className={styles.title}>
            {locale === "hi"
              ? `${demoCase.persona.displayName} हेतु शिकायत याचिका तैयार करें`
              : `Draft Statutory Grievance for ${demoCase.persona.displayName}`}
          </h2>
          <p className={styles.description}>
            {locale === "hi"
              ? "ईपीएफओ के नियम संदर्भों, बैंक विवरणों और साक्ष्यों के साथ सटीक याचिका पत्र तैयार करें और 15-दिवसीय नागरिक चार्टर समयसीमा ट्रैक करें।"
              : "Generate an explainable, regulation-cited petition for EPFiGMS, track required documentary evidence, and manage statutory Citizen's Charter SLAs."}
          </p>
        </div>
        <Button variant="quiet" onClick={onBack}>
          {locale === "hi" ? "← वर्कस्पेस पर लौटें" : "Back to workspace"}
        </Button>
      </header>

      <Callout
        title={
          locale === "hi"
            ? "EPFiGMS सिमुलेशन दिशानिर्देश"
            : "EPFiGMS Portal Mock Guidelines"
        }
      >
        {locale === "hi"
          ? "यह याचिका ड्राफ्ट ईपीएफ योजना नियमों (उदा. आवास अग्रिम हेतु Para 68B) का उल्लेख करता है। वास्तविक EPFiGMS पोर्टल पर सबमिट करने हेतु कॉपी या डाउनलोड करें।"
          : "This draft cites EPFO statutory provisions and verified transaction facts. Export or copy the text to file on the live EPFiGMS portal."}
      </Callout>

      <div className={styles.bodyGrid}>
        {/* Left Column: Editable Petition Form */}
        <section
          className={styles.petitionSection}
          aria-labelledby="petition-heading"
        >
          <div className={styles.sectionHeader}>
            <h3 id="petition-heading">
              {locale === "hi"
                ? "याचिका पत्र संपादक"
                : "Statutory Petition Editor"}
            </h3>
            <span className={styles.sectionMeta}>
              {record.category} · {record.claimId}
            </span>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="grievance-subject" className={styles.fieldLabel}>
              {locale === "hi"
                ? "शिकायत का विषय (Grievance Subject)"
                : "Grievance Subject"}
            </label>
            <input
              id="grievance-subject"
              type="text"
              className={styles.input}
              value={record.subject}
              onChange={handleSubjectChange}
              aria-label={
                locale === "hi" ? "शिकायत का विषय" : "Grievance Subject"
              }
            />
          </div>

          <div className={styles.statutoryBox}>
            <span className={styles.statutoryTitle}>
              {locale === "hi"
                ? "कानूनी आधार एवं नियम संदर्भ:"
                : "Statutory Scheme Grounds:"}
            </span>
            <p className={styles.statutoryText}>{record.subject}</p>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="petition-body" className={styles.fieldLabel}>
                {locale === "hi"
                  ? "औपचारिक याचिका पत्र"
                  : "Formal Petition Text"}
              </label>
              <span className={styles.charCount}>
                {record.petitionText.length}{" "}
                {locale === "hi" ? "अक्षर" : "characters"}
              </span>
            </div>
            <textarea
              id="petition-body"
              className={styles.textarea}
              rows={12}
              value={record.petitionText}
              onChange={handlePetitionChange}
              aria-label={
                locale === "hi" ? "औपचारिक याचिका पत्र" : "Formal Petition Text"
              }
            />
          </div>

          <div className={styles.petitionActions}>
            <Button
              variant="secondary"
              onClick={handleCopyText}
              aria-live="polite"
            >
              {copied
                ? t.common.copied
                : locale === "hi"
                  ? "याचिका कॉपी करें"
                  : "Copy Petition to Clipboard"}
            </Button>
            <Button variant="quiet" onClick={handleDownloadText}>
              {locale === "hi" ? "डाउनलोड करें (.txt)" : "Download (.txt)"}
            </Button>
            <Button variant="quiet" onClick={handleReset}>
              {locale === "hi" ? "मूल ड्राफ्ट रीसेट करें" : "Reset Default"}
            </Button>
          </div>
        </section>

        {/* Right Column: Evidence Checklist & EPFiGMS Registration */}
        <aside
          className={styles.sideSection}
          aria-labelledby="evidence-heading"
        >
          {/* Evidence Checklist */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 id="evidence-heading">
                {locale === "hi"
                  ? "संलग्न साक्ष्य दस्तावेज"
                  : "Supporting Evidence"}
              </h3>
              <span className={styles.evidenceCounter}>
                {attachedCount} / {record.evidenceList.length}{" "}
                {locale === "hi" ? "संलग्न" : "attached"}
              </span>
            </div>
            <p className={styles.cardSub}>
              {locale === "hi"
                ? "त्वरित समाधान हेतु आवश्यक दस्तावेज संलग्न करें:"
                : "Check items included with your petition for faster resolution:"}
            </p>

            <ul className={styles.evidenceList}>
              {record.evidenceList.map((item) => (
                <li key={item.id} className={styles.evidenceItem}>
                  <label className={styles.evidenceLabel}>
                    <input
                      type="checkbox"
                      checked={item.attached}
                      onChange={() => handleToggleEvidence(item.id)}
                      className={styles.checkbox}
                      aria-label={`Toggle evidence: ${item.title}`}
                    />
                    <div className={styles.evidenceText}>
                      <strong>{item.title}</strong>
                      <small>{item.description}</small>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </section>

          {/* EPFiGMS Docket Registration Simulation */}
          <section
            className={styles.card}
            aria-labelledby="registration-heading"
          >
            <div className={styles.cardHeader}>
              <h3 id="registration-heading">
                {locale === "hi" ? "EPFiGMS डॉकेट" : "EPFiGMS Registration"}
              </h3>
              <StatusBadge tone={isRegistered ? "success" : "warning"}>
                {isRegistered
                  ? locale === "hi"
                    ? "डॉकेट दर्ज"
                    : "Docket Registered"
                  : locale === "hi"
                    ? "प्रारूप तैयार"
                    : "Draft Ready"}
              </StatusBadge>
            </div>

            {isRegistered ? (
              <div className={styles.docketBox}>
                <span className={styles.docketLabel}>
                  {locale === "hi"
                    ? "सिम्युलेटेड डॉकेट नंबर"
                    : "Mock EPFiGMS Docket Number"}
                </span>
                <strong className={styles.docketNum}>
                  {record.registrationNumber}
                </strong>
                <small className={styles.docketDate}>
                  {locale === "hi" ? "पंजीकरण तिथि: " : "Registered on: "}
                  {record.registeredAt
                    ? new Date(record.registeredAt).toLocaleDateString(
                        locale === "hi" ? "hi-IN" : "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )
                    : ""}
                </small>
              </div>
            ) : (
              <div className={styles.unregisteredBox}>
                <p>
                  {locale === "hi"
                    ? "याचिका समीक्षा के उपरांत एक काल्पनिक डॉकेट संदर्भ संख्या उत्पन्न करें।"
                    : "Simulate registration to test 15-day SLA reminder tracking in this demo."}
                </p>
                <Button onClick={handleRegister} className={styles.registerBtn}>
                  {locale === "hi"
                    ? "सिम्युलेटेड डॉकेट दर्ज करें →"
                    : "Simulate EPFiGMS Registration →"}
                </Button>
              </div>
            )}
          </section>

          {/* 15-Day Citizen's Charter SLA Tracker */}
          <section className={styles.card} aria-labelledby="sla-heading">
            <div className={styles.cardHeader}>
              <h3 id="sla-heading">
                {locale === "hi"
                  ? "15-दिवसीय नागरिक चार्टर"
                  : "15-Day Citizen's Charter SLA"}
              </h3>
              <StatusBadge tone="info">
                {locale === "hi" ? "15 दिन SLA" : "15-Day Target"}
              </StatusBadge>
            </div>

            <p className={styles.cardSub}>
              {locale === "hi"
                ? "ईपीएफओ नागरिक चार्टर के अनुसार प्रत्येक शिकायत का 15 कार्य दिवसों में समाधान अनिवार्य है।"
                : "EPFO Citizen's Charter mandates resolution within 15 working days from registration."}
            </p>

            <div className={styles.slaMeterWrap}>
              <div className={styles.slaStats}>
                <span>
                  {locale === "hi" ? "शेष समयसीमा:" : "Resolution Window:"}
                </span>
                <strong>
                  {record.slaDaysRemaining} / 15{" "}
                  {locale === "hi" ? "दिन शेष" : "days remaining"}
                </strong>
              </div>
              <div
                className={styles.slaProgressBar}
                aria-label={locale === "hi" ? "SLA प्रगति" : "SLA Progress"}
              >
                <span
                  className={styles.slaProgressFill}
                  style={{
                    width: `${Math.max(
                      10,
                      ((15 - record.slaDaysRemaining) / 15) * 100,
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className={styles.reminderToggle}>
              <label className={styles.reminderLabel}>
                <input
                  type="checkbox"
                  checked={record.reminderActive}
                  onChange={handleToggleReminder}
                  className={styles.checkbox}
                  aria-label="Toggle calendar SLA reminder"
                />
                <span>
                  {locale === "hi"
                    ? "15-दिवसीय समाप्ति पर कैलेंडर रिमाइंडर सक्षम करें"
                    : "Enable mock reminder at Day 15 SLA deadline"}
                </span>
              </label>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
