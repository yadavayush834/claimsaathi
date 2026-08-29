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

import styles from "./claim-timeline.module.css";

type ClaimTimelineProps = Readonly<{
  demoCase: DemoCase;
  onBack: () => void;
}>;

const statusConfig: Record<
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

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(date: string) {
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

export function ClaimTimeline({ demoCase, onBack }: ClaimTimelineProps) {
  const [timeline, setTimeline] = useState<DemoClaimTimelineRecord>(() =>
    getTimelineForPersona(demoCase.persona.id),
  );

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
          <div className={styles.headerTitles}>
            <p className={styles.eyebrow}>
              Claim status tracking · sandbox simulation
            </p>
            <h2 id="timeline-title">
              {demoCase.persona.displayName}&apos;s Claim Status
            </h2>
            <div className={styles.headerMeta}>
              <span className={styles.refCode}>
                Claim ID: <strong>{timeline.claimId}</strong>
              </span>
              {timeline.acknowledgementNumber ? (
                <span className={styles.ackCode}>
                  ACK: <strong>{timeline.acknowledgementNumber}</strong>
                </span>
              ) : null}
              <span className={styles.stateChip}>
                {demoCase.persona.homeState}
              </span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <StatusBadge tone={currentStatus.tone}>
              {currentStatus.label}
            </StatusBadge>
            <Button variant="quiet" onClick={onBack}>
              Back to workspace
            </Button>
          </div>
        </div>
      </header>

      {/* Stepper Card */}
      <section
        className={styles.stepperCard}
        aria-label="Claim milestone progress"
      >
        <h3 className={styles.sectionHeading}>Claim milestones</h3>
        <ol className={styles.stepperList}>
          {milestones.map((m, index) => (
            <li
              key={m.stage}
              className={styles.stepperItem}
              data-state={m.state}
            >
              <div className={styles.stepIndicator}>
                <span className={styles.stepCircle} aria-hidden="true">
                  {m.state === "completed" ? "✓" : index + 1}
                </span>
                {index < milestones.length - 1 ? (
                  <span className={styles.stepConnector} aria-hidden="true" />
                ) : null}
              </div>
              <div className={styles.stepContent}>
                <strong
                  aria-current={m.state === "current" ? "step" : undefined}
                >
                  {m.label}
                </strong>
                <p>{m.summary}</p>
                <span className={styles.stepStateTag}>
                  {m.state === "completed"
                    ? "Completed"
                    : m.state === "current"
                      ? "In progress"
                      : "Upcoming"}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Main Status & Pending Action Details */}
      <div className={styles.mainGrid}>
        <section
          className={styles.actionCard}
          aria-labelledby="pending-action-title"
        >
          <div className={styles.cardHeader}>
            <p className={styles.cardEyebrow}>Current stage</p>
            <StatusBadge tone={currentStatus.tone}>
              {currentStatus.label}
            </StatusBadge>
          </div>
          <h3 id="pending-action-title">{timeline.pendingAction.title}</h3>
          <p className={styles.actionDesc}>
            {timeline.pendingAction.description}
          </p>

          <dl className={styles.keyInfoGrid}>
            <div>
              <dt>Requested amount</dt>
              <dd className={styles.highlightAmount}>
                {currencyFormatter.format(timeline.requestedAmountRupees)}
              </dd>
            </div>
            <div>
              <dt>Claim purpose</dt>
              <dd>PF advance (Medical treatment)</dd>
            </div>
            <div>
              <dt>Fictional payout account</dt>
              <dd>Asha Verma · •••• 8421</dd>
            </div>
            <div>
              <dt>Simulated timeline</dt>
              <dd>3–5 working days</dd>
            </div>
          </dl>
        </section>

        {/* Simulation Controls for Demo Reviewer */}
        <section
          className={styles.controlsCard}
          aria-labelledby="controls-title"
        >
          <div className={styles.cardHeader}>
            <p className={styles.cardEyebrow}>Demo Reviewer Controls</p>
            <StatusBadge tone="neutral">Simulation</StatusBadge>
          </div>
          <h3 id="controls-title">Advance claim lifecycle</h3>
          <p className={styles.controlsDesc}>
            Step forward through simulated processing states to view realistic
            events and status changes.
          </p>

          <div className={styles.controlsActions}>
            <Button
              onClick={handleAdvance}
              disabled={timeline.status === "settled"}
            >
              {timeline.status === "settled"
                ? "Claim settled in demo"
                : "Advance simulated status →"}
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              Reset to baseline
            </Button>
          </div>
          <small className={styles.controlsHint}>
            Changes are saved to this browser for refresh recovery.
          </small>
        </section>
      </div>

      {/* Comprehensive Event Ledger */}
      <section className={styles.eventsCard} aria-labelledby="activity-title">
        <div className={styles.cardHeader}>
          <div>
            <p className={styles.cardEyebrow}>Event ledger</p>
            <h3 id="activity-title">Claim history & activity log</h3>
          </div>
          <span className={styles.eventsMeta}>Newest first</span>
        </div>

        <ol className={styles.eventsList}>
          {timeline.events.map((evt) => (
            <li key={evt.id} className={styles.eventItem}>
              <time dateTime={evt.occurredOn}>
                {formatDate(evt.occurredOn)}
              </time>
              <div className={styles.eventBody}>
                <strong>{evt.title}</strong>
                <p>{evt.description}</p>
                <span className={styles.sourceTag}>
                  Simulation log · {evt.id}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <footer className={styles.footer}>
        <p>
          All claim states and timeline events are synthetic prototype data. No
          government system is contacted.
        </p>
        <Button variant="secondary" onClick={onBack}>
          Return to workspace
        </Button>
      </footer>
    </section>
  );
}
