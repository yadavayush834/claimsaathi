"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  DemoCase,
  DemoClaimStatus,
  DemoIssueTone,
} from "@/lib/demo/model";
import { getTimelineForPersona } from "@/lib/demo/timeline-service";
import { useLocale } from "@/lib/i18n/locale-context";

import styles from "./claim-workspace.module.css";

type ClaimWorkspaceProps = Readonly<{
  demoCase: DemoCase;
  sessionMessage: string;
  onSwitch: () => void;
  onPlanWithdrawal?: () => void;
  onReviewPreflight?: () => void;
  onViewTimeline?: () => void;
  onExplainIssue?: () => void;
  onStartRecovery?: () => void;
  onReconcileSettlement?: () => void;
  onPrepareGrievance?: () => void;
}>;

const claimStatusLabelsEn: Record<DemoClaimStatus, string> = {
  draft: "Draft ready",
  submitted: "Submitted in demo",
  under_process: "Under review",
  action_needed: "Action needed",
  approved: "Approved",
  settled: "Settled in demo",
  rejected: "Rejected in demo",
};

const claimStatusLabelsHi: Record<DemoClaimStatus, string> = {
  draft: "प्रारूप तैयार",
  submitted: "सबमिट किया गया",
  under_process: "समीक्षाधीन",
  action_needed: "कार्रवाई आवश्यक",
  approved: "स्वीकृत",
  settled: "निपटारा पूर्ण",
  rejected: "अस्वीकृत",
};

const claimStatusTones: Record<
  DemoClaimStatus,
  "neutral" | "info" | "warning" | "success" | "critical"
> = {
  draft: "neutral",
  submitted: "info",
  under_process: "info",
  action_needed: "warning",
  approved: "success",
  settled: "success",
  rejected: "critical",
};

const issueTones: Record<DemoIssueTone, "success" | "critical" | "warning"> = {
  clear: "success",
  attention: "critical",
  review: "warning",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatDate(isoDate: string, locale: "en" | "hi"): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) {
    return isoDate;
  }
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(locale === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function computeSharePercentages(balance: {
  employeeShareRupees: number;
  employerShareRupees: number;
  pensionShareRupees: number;
}) {
  const total =
    balance.employeeShareRupees +
    balance.employerShareRupees +
    balance.pensionShareRupees;
  if (total === 0) {
    return {
      employeeSharePct: 33,
      employerSharePct: 33,
      pensionSharePct: 34,
      totalRupees: 0,
    };
  }
  const employeeSharePct = Math.round(
    (balance.employeeShareRupees / total) * 100,
  );
  const employerSharePct = Math.round(
    (balance.employerShareRupees / total) * 100,
  );
  const pensionSharePct = 100 - employeeSharePct - employerSharePct;
  return {
    employeeSharePct,
    employerSharePct,
    pensionSharePct,
    totalRupees: total,
  };
}

export function ClaimWorkspace({
  demoCase,
  sessionMessage,
  onSwitch,
  onPlanWithdrawal,
  onReviewPreflight,
  onViewTimeline,
  onExplainIssue,
  onStartRecovery,
  onReconcileSettlement,
  onPrepareGrievance,
}: ClaimWorkspaceProps) {
  const { locale, t } = useLocale();
  const { persona, workspace } = demoCase;

  const timeline = useMemo(() => {
    return getTimelineForPersona(persona.id);
  }, [persona.id]);

  const activeStatus = timeline.status;
  const activeEvents =
    timeline.events.length > 0 ? timeline.events : workspace.recentEvents;

  const { employeeSharePct, employerSharePct, pensionSharePct, totalRupees } =
    computeSharePercentages(workspace.balance);

  const claimStatusLabels =
    locale === "hi" ? claimStatusLabelsHi : claimStatusLabelsEn;
  const claimHeading = `${t.demo.activeClaim} · ${persona.scenarioTitle}`;

  return (
    <section className={styles.workspace} aria-labelledby="workspace-title">
      <header className={styles.workspaceHeader}>
        <div className={styles.personaBanner}>
          <div className={styles.personaAvatar} aria-hidden="true">
            {persona.displayName
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className={styles.personaDetails}>
            <p className={styles.fixtureEyebrow}>
              {locale === "hi"
                ? `काल्पनिक दावा वर्कस्पेस · फिक्सचर v${demoCase.fixtureVersion}`
                : `Fictional claim workspace · fixture v${demoCase.fixtureVersion}`}
            </p>
            <h2 id="workspace-title">{persona.displayName}</h2>
            <div className={styles.scenarioRow}>
              <span className={styles.scenarioTitle}>
                {persona.scenarioTitle}
              </span>
              <span className={styles.stateChip}>{persona.homeState}</span>
            </div>
          </div>
        </div>
        <div className={styles.headerBadges}>
          <StatusBadge tone="success">
            {locale === "hi" ? "डेमो सत्र सक्रिय" : "Demo session active"}
          </StatusBadge>
          <Button
            variant="secondary"
            onClick={onSwitch}
            className={styles.switchTopBtn}
            aria-label={t.common.switchCitizen}
          >
            {t.common.switchCitizen}
          </Button>
        </div>
      </header>

      <div className={styles.sessionBanner}>
        <span className={styles.sessionDot} aria-hidden="true" />
        <p className={styles.sessionNote} aria-live="polite">
          {sessionMessage}
        </p>
      </div>

      <section
        className={styles.nextAction}
        aria-labelledby="next-action-title"
      >
        <div className={styles.nextActionLabel}>
          <span aria-hidden="true">→</span>
          <p>{locale === "hi" ? "आगे क्या करना है" : "What to do next"}</p>
        </div>
        <div className={styles.nextActionBody}>
          <div className={styles.nextActionHeading}>
            <h3 id="next-action-title">{workspace.nextAction.title}</h3>
            <StatusBadge
              tone={
                onPlanWithdrawal || onReviewPreflight || onViewTimeline
                  ? "info"
                  : "neutral"
              }
            >
              {onPlanWithdrawal || onReviewPreflight || onViewTimeline
                ? locale === "hi"
                  ? "अभी उपलब्ध"
                  : "Available now"
                : locale === "hi"
                  ? "यात्रा पूर्वावलोकन"
                  : "Journey preview"}
            </StatusBadge>
          </div>
          <p className={styles.nextActionDesc}>
            {workspace.nextAction.description}
          </p>
          <small className={styles.nextActionHint}>
            {onPlanWithdrawal
              ? locale === "hi"
                ? "काल्पनिक उत्तरों और नियम-आधारित पॉलिसी का उपयोग करता है।"
                : "Uses fictional answers and a deterministic mock policy."
              : onReviewPreflight
                ? locale === "hi"
                  ? "स्थानीय काल्पनिक रिकॉर्ड की तुलना करता है और सुधार का उत्तरदायित्व समझाता है।"
                  : "Compares local synthetic records and explains who owns each correction."
                : onViewTimeline
                  ? locale === "hi"
                    ? "सिम्युलेटेड सत्यापन चरणों के माध्यम से आपके दावे को ट्रैक करता है।"
                    : "Tracks your submitted mock claim through the simulated verification stages."
                  : locale === "hi"
                    ? "यह वर्कस्पेस अगले चरण की पहचान करता है।"
                    : "This workspace identifies the next step; the guided action is added in its later build phase."}
          </small>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {onPlanWithdrawal ? (
              <Button
                className={styles.planActionBtn}
                onClick={onPlanWithdrawal}
              >
                {locale === "hi"
                  ? "मॉक निकासी राशि प्लान करें"
                  : "Plan mock withdrawal"}
              </Button>
            ) : null}
            {onStartRecovery ? (
              <Button
                className={styles.planActionBtn}
                onClick={onStartRecovery}
              >
                {locale === "hi"
                  ? "रिजेक्शन सुधार यात्रा शुरू करें →"
                  : "Start rejection recovery journey →"}
              </Button>
            ) : onReconcileSettlement ? (
              <Button
                className={styles.planActionBtn}
                onClick={onReconcileSettlement}
              >
                {locale === "hi"
                  ? "मॉक निपटान राशियों की तुलना करें →"
                  : "Compare mock settlement amounts →"}
              </Button>
            ) : onReviewPreflight ? (
              <Button
                className={styles.planActionBtn}
                onClick={onReviewPreflight}
              >
                {locale === "hi"
                  ? "तैयारी प्री-फ्लाइट जांच चलाएं"
                  : "Run readiness preflight"}
              </Button>
            ) : null}
            {onViewTimeline ? (
              <Button variant="secondary" onClick={onViewTimeline}>
                {locale === "hi"
                  ? "दावा स्थिति समयरेखा देखें →"
                  : "Track claim timeline →"}
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <div className={styles.summaryGrid}>
        <section
          className={styles.ledgerSection}
          aria-labelledby="balance-title"
        >
          <div className={styles.sectionLabel}>
            <p>{locale === "hi" ? "शेष राशि" : "Balance"}</p>
            <StatusBadge tone="neutral">{t.common.synthetic}</StatusBadge>
          </div>
          <h3 id="balance-title">
            {locale === "hi" ? "काल्पनिक पीएफ शेष" : "Synthetic PF balance"}
          </h3>
          <strong className={styles.balanceTotal}>
            {currencyFormatter.format(totalRupees)}
          </strong>

          <div className={styles.balanceBar} aria-hidden="true">
            <span
              className={styles.employeeBar}
              style={{ width: `${employeeSharePct}%` }}
              title={`Employee: ${employeeSharePct}%`}
            />
            <span
              className={styles.employerBar}
              style={{ width: `${employerSharePct}%` }}
              title={`Employer: ${employerSharePct}%`}
            />
            <span
              className={styles.pensionBar}
              style={{ width: `${pensionSharePct}%` }}
              title={`Pension: ${pensionSharePct}%`}
            />
          </div>

          <dl className={styles.balanceBreakdown}>
            <div className={styles.shareRow}>
              <dt>
                <span
                  className={`${styles.shareDot} ${styles.employeeDot}`}
                  aria-hidden="true"
                />
                {locale === "hi" ? "कर्मचारी हिस्सा" : "Employee share"}
              </dt>
              <dd>
                {currencyFormatter.format(
                  workspace.balance.employeeShareRupees,
                )}
              </dd>
            </div>
            <div className={styles.shareRow}>
              <dt>
                <span
                  className={`${styles.shareDot} ${styles.employerDot}`}
                  aria-hidden="true"
                />
                {locale === "hi" ? "नियोक्ता हिस्सा" : "Employer share"}
              </dt>
              <dd>
                {currencyFormatter.format(
                  workspace.balance.employerShareRupees,
                )}
              </dd>
            </div>
            <div className={styles.shareRow}>
              <dt>
                <span
                  className={`${styles.shareDot} ${styles.pensionDot}`}
                  aria-hidden="true"
                />
                {locale === "hi" ? "पेंशन हिस्सा" : "Pension share"}
              </dt>
              <dd>
                {currencyFormatter.format(workspace.balance.pensionShareRupees)}
              </dd>
            </div>
          </dl>
          <p className={styles.scopeNote}>
            {locale === "hi"
              ? "रिकॉर्ड पर उपलब्ध शेष राशि सीधे पात्रता का परिणाम नहीं है।"
              : "Balance on record is not an eligibility result."}
          </p>
        </section>

        <section className={styles.ledgerSection} aria-labelledby="claim-title">
          <div className={styles.sectionLabel}>
            <p>{locale === "hi" ? "दावा" : "Claim"}</p>
            <StatusBadge tone={claimStatusTones[activeStatus]}>
              {claimStatusLabels[activeStatus]}
            </StatusBadge>
          </div>
          <h3 id="claim-title">{claimHeading}</h3>
          <strong className={styles.claimAmount}>
            {currencyFormatter.format(timeline.requestedAmountRupees)}
          </strong>
          <dl className={styles.claimDetails}>
            <div>
              <dt>{locale === "hi" ? "संदर्भ संख्या" : "Reference"}</dt>
              <dd className={styles.refCode}>{timeline.claimId}</dd>
            </div>
            <div>
              <dt>{locale === "hi" ? "अनुरोध प्रकार" : "Request type"}</dt>
              <dd>{locale === "hi" ? "पीएफ अग्रिम" : "PF advance"}</dd>
            </div>
            {timeline.acknowledgementNumber ? (
              <div>
                <dt>{locale === "hi" ? "पावती" : "Acknowledgement"}</dt>
                <dd className={styles.refCode}>
                  {timeline.acknowledgementNumber}
                </dd>
              </div>
            ) : (
              <div>
                <dt>{locale === "hi" ? "अंतिम अपडेट" : "Last update"}</dt>
                <dd>
                  {activeEvents[0]?.title ??
                    (locale === "hi" ? "प्रारूप खोला गया" : "Draft opened")}
                </dd>
              </div>
            )}
          </dl>
          {onViewTimeline ? (
            <div style={{ marginTop: "1rem" }}>
              <Button
                variant="quiet"
                onClick={onViewTimeline}
                style={{ padding: "0.4rem 0.6rem", fontSize: "0.85rem" }}
              >
                {locale === "hi"
                  ? "पूर्ण स्थिति समयरेखा देखें →"
                  : "View full status timeline →"}
              </Button>
            </div>
          ) : null}
        </section>
      </div>

      <div className={styles.detailGrid}>
        <section
          className={styles.issueSection}
          data-tone={workspace.issue.tone}
          aria-labelledby="issue-title"
        >
          <div className={styles.sectionLabel}>
            <p>{locale === "hi" ? "समस्या स्थिति" : "Issue state"}</p>
            <StatusBadge tone={issueTones[workspace.issue.tone]}>
              {workspace.issue.ownerLabel}
            </StatusBadge>
          </div>
          <h3 id="issue-title">{workspace.issue.title}</h3>
          <p>{workspace.issue.description}</p>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginTop: "0.85rem",
            }}
          >
            {onExplainIssue ? (
              <Button
                variant="secondary"
                onClick={onExplainIssue}
                style={{ padding: "0.45rem 0.8rem", fontSize: "0.85rem" }}
              >
                {locale === "hi"
                  ? "एआई इंटरप्रेटर से समझें →"
                  : "Explain with AI Interpreter →"}
              </Button>
            ) : null}
            {onPrepareGrievance ? (
              <Button
                variant="quiet"
                onClick={onPrepareGrievance}
                style={{ padding: "0.45rem 0.8rem", fontSize: "0.85rem" }}
              >
                {locale === "hi"
                  ? "EPFiGMS शिकायत पत्र तैयार करें →"
                  : "Prepare EPFiGMS Grievance →"}
              </Button>
            ) : null}
          </div>
        </section>

        <section
          className={styles.eventsSection}
          aria-labelledby="events-title"
        >
          <div className={styles.sectionLabel}>
            <p>{locale === "hi" ? "हाल की गतिविधि" : "Recent activity"}</p>
            <span className={styles.eventsMeta}>
              {locale === "hi" ? "नवीनतम पहले" : "Newest first"}
            </span>
          </div>
          <h3 id="events-title">
            {locale === "hi" ? "हाल की घटनाएं" : "Recent events"}
          </h3>
          <ol>
            {activeEvents.map((event) => (
              <li key={event.id}>
                <time dateTime={event.occurredOn}>
                  {formatDate(event.occurredOn, locale)}
                </time>
                <div>
                  <strong>{event.title}</strong>
                  <p>{event.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
}
