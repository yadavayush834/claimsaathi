"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  DemoCase,
  DemoClaimStatus,
  DemoClaimTimelineRecord,
} from "@/lib/demo/model";
import {
  advanceClaimStatus,
  getTimelineForPersona,
  getTimelineMilestones,
  resetTimeline,
} from "@/lib/demo/timeline-service";
import { useLocale } from "@/lib/i18n/locale-context";

import styles from "./claim-timeline.module.css";

type ClaimTimelineProps = Readonly<{
  demoCase: DemoCase;
  onBack: () => void;
  onStartRecovery?: () => void;
}>;

const statusConfigEn: Record<
  DemoClaimStatus,
  {
    label: string;
    tone: "neutral" | "info" | "warning" | "success" | "critical";
  }
> = {
  draft: { label: "Draft ready", tone: "neutral" },
  submitted: { label: "Submitted in demo", tone: "info" },
  under_process: { label: "Under field review", tone: "info" },
  action_needed: { label: "Action needed", tone: "warning" },
  approved: { label: "Approved & sanctioned", tone: "success" },
  settled: { label: "Settled in demo", tone: "success" },
  rejected: { label: "Rejected in demo", tone: "critical" },
};

const statusConfigHi: Record<
  DemoClaimStatus,
  {
    label: string;
    tone: "neutral" | "info" | "warning" | "success" | "critical";
  }
> = {
  draft: { label: "प्रारूप तैयार", tone: "neutral" },
  submitted: { label: "सबमिट किया गया", tone: "info" },
  under_process: { label: "क्षेत्रीय कार्यालय में समीक्षाधीन", tone: "info" },
  action_needed: { label: "कार्रवाई आवश्यक", tone: "warning" },
  approved: { label: "स्वीकृत एवं संस्वीकृत", tone: "success" },
  settled: { label: "निपटारा पूर्ण", tone: "success" },
  rejected: { label: "अस्वीकृत", tone: "critical" },
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatDate(date: string, locale: "en" | "hi") {
  const dateFormatter = new Intl.DateTimeFormat(
    locale === "hi" ? "hi-IN" : "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    },
  );
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ClaimTimeline({
  demoCase,
  onBack,
  onStartRecovery,
}: ClaimTimelineProps) {
  const { locale } = useLocale();
  const [timeline, setTimeline] = useState<DemoClaimTimelineRecord>(() =>
    getTimelineForPersona(demoCase.persona.id),
  );

  const statusConfig = locale === "hi" ? statusConfigHi : statusConfigEn;
  const currentStatus = statusConfig[timeline.status] ?? {
    label: timeline.status,
    tone: "info" as const,
  };

  const milestones = getTimelineMilestones(timeline);

  function handleAdvance() {
    const nextRecord = advanceClaimStatus(demoCase.persona.id);
    setTimeline(nextRecord);
  }

  function handleReset() {
    const baseline = resetTimeline(demoCase.persona.id);
    setTimeline(baseline);
  }

  return (
    <section className={styles.timeline} aria-labelledby="timeline-title">
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.avatarWrap} aria-hidden="true">
            {getInitials(demoCase.persona.displayName)}
          </div>
          <div className={styles.headerInfo}>
            <p className={styles.eyebrow}>
              {locale === "hi"
                ? "दावा स्थिति ट्रैकर · स्थानीय अनुकरण"
                : "Claim status tracker · local simulation"}
            </p>
            <h2 id="timeline-title">
              {locale === "hi"
                ? `${demoCase.persona.displayName} का दावा समयरेखा`
                : `${demoCase.persona.displayName}'s Claim Timeline`}
            </h2>
            <div className={styles.metaRow}>
              <span className={styles.refCode}>
                {locale === "hi" ? "दावा आईडी: " : "Claim ID: "}
                {timeline.claimId}
              </span>
              <span className={styles.stateChip}>
                {demoCase.persona.homeState}
              </span>
              <StatusBadge tone={currentStatus.tone}>
                {currentStatus.label}
              </StatusBadge>
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="quiet" onClick={onBack}>
            {locale === "hi" ? "← वर्कस्पेस पर लौटें" : "Back to workspace"}
          </Button>
        </div>
      </header>

      {/* Snapshot summary */}
      <div className={styles.snapshot}>
        <div className={styles.snapshotCard}>
          <span>
            {locale === "hi" ? "अनुरोध प्रकार" : "Claim Request Type"}
          </span>
          <strong>PF Advance</strong>
          <small>
            {locale === "hi" ? "काल्पनिक फॉर्म 31" : "Form 31 simulation"}
          </small>
        </div>
        <div className={styles.snapshotCard}>
          <span>{locale === "hi" ? "दावा राशि" : "Requested Amount"}</span>
          <strong className={styles.amount}>
            {currencyFormatter.format(timeline.requestedAmountRupees)}
          </strong>
          <small>{locale === "hi" ? "काल्पनिक राशि" : "Synthetic value"}</small>
        </div>
        <div className={styles.snapshotCard}>
          <span>{locale === "hi" ? "पावती रसीद" : "Acknowledgement"}</span>
          <strong className={styles.ackCode}>
            {timeline.acknowledgementNumber ??
              (locale === "hi" ? "लंबित" : "Pending")}
          </strong>
          <small>
            {locale === "hi" ? "अंतिम स्थिति: " : "Current stage: "}
            {currentStatus.label}
          </small>
        </div>
      </div>

      {/* Milestone Progress Path */}
      <section
        className={styles.milestonesSection}
        aria-labelledby="milestones-heading"
      >
        <div className={styles.sectionHeader}>
          <h3 id="milestones-heading">
            {locale === "hi" ? "प्रक्रिया चरण" : "Lifecycle Stages"}
          </h3>
          <span className={styles.sectionHint}>
            {locale === "hi"
              ? "स्थानीय रूप से प्रबंधित सिम्युलेटेड चरण"
              : "Locally managed mock milestones"}
          </span>
        </div>

        <ol className={styles.milestoneList}>
          {milestones.map((milestone) => (
            <li
              key={milestone.stage}
              className={styles.milestoneItem}
              data-state={milestone.state}
            >
              <div className={styles.milestoneIconWrap}>
                <div className={styles.milestoneIcon} aria-hidden="true">
                  {milestone.state === "completed" ? (
                    "✓"
                  ) : milestone.state === "current" ? (
                    <span className={styles.pulseDot} />
                  ) : (
                    "○"
                  )}
                </div>
                <div className={styles.milestoneLine} aria-hidden="true" />
              </div>
              <div className={styles.milestoneContent}>
                <div className={styles.milestoneHeader}>
                  <strong>{milestone.label}</strong>
                  {milestone.date ? (
                    <time dateTime={milestone.date}>
                      {formatDate(milestone.date, locale)}
                    </time>
                  ) : null}
                </div>
                <p>{milestone.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Audit Event Log */}
      <section
        className={styles.eventsSection}
        aria-labelledby="events-heading"
      >
        <div className={styles.sectionHeader}>
          <h3 id="events-heading">
            {locale === "hi" ? "गतिविधि विवरण" : "Audit Event Log"}
          </h3>
          <span className={styles.sectionHint}>
            {locale === "hi" ? "नवीनतम पहले" : "Chronological event ledger"}
          </span>
        </div>

        <ol className={styles.eventList}>
          {timeline.events.map((event) => (
            <li key={event.id} className={styles.eventItem}>
              <div className={styles.eventDate} aria-hidden="true">
                <time dateTime={event.occurredOn}>
                  {formatDate(event.occurredOn, locale)}
                </time>
              </div>
              <div className={styles.eventBody}>
                <strong>{event.title}</strong>
                <p>{event.description}</p>
                <time
                  className={styles.eventDateMobile}
                  dateTime={event.occurredOn}
                >
                  {formatDate(event.occurredOn, locale)}
                </time>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Timeline Controls */}
      <div className={styles.controlsBar}>
        <div className={styles.controlsLeft}>
          <Button
            variant="secondary"
            onClick={handleAdvance}
            className={styles.advanceBtn}
          >
            {locale === "hi"
              ? "अगला सिम्युलेशन चरण बढ़ाएं →"
              : "Simulate next lifecycle step →"}
          </Button>
          <Button variant="quiet" onClick={handleReset}>
            {locale === "hi" ? "समयरेखा रीसेट करें" : "Reset timeline"}
          </Button>
        </div>
        {onStartRecovery ? (
          <Button onClick={onStartRecovery}>
            {locale === "hi"
              ? "रिजेक्शन सुधार यात्रा शुरू करें →"
              : "Start rejection recovery journey →"}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
