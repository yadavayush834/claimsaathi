"use client";

import { useState, type CSSProperties } from "react";

import styles from "./journey-preview.module.css";

const stages = [
  {
    id: "plan",
    label: "Plan",
    kicker: "Before you begin",
    title: "Know what the numbers mean.",
    description:
      "See the balance considered, the amount protected, and the rule that limits the result.",
    metricLabel: "Mock eligible amount",
    metricValue: "₹75,000",
    note: "Pension share shown separately",
    tone: "violet",
  },
  {
    id: "prepare",
    label: "Prepare",
    kicker: "Before submission",
    title: "Fix blockers while they are small.",
    description:
      "Identity, bank, and evidence checks point to the person who can correct each mismatch.",
    metricLabel: "Readiness checks",
    metricValue: "4 of 5",
    note: "One bank-name check needs attention",
    tone: "amber",
  },
  {
    id: "track",
    label: "Track",
    kicker: "After submission",
    title: "A status becomes a next action.",
    description:
      "Every update explains whether to wait, correct something, contact an employer, or follow up.",
    metricLabel: "Current stage",
    metricValue: "Under review",
    note: "Last mock update: today",
    tone: "blue",
  },
  {
    id: "recover",
    label: "Recover",
    kicker: "When something goes wrong",
    title: "A rejection is not a dead end.",
    description:
      "Connect the reason, correction checklist, evidence, and grievance route in one place.",
    metricLabel: "Next owner",
    metricValue: "Citizen",
    note: "Plain-language correction available",
    tone: "green",
  },
] as const;

export function JourneyPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStage = stages[activeIndex];
  const routeStyle = { "--active-step": activeIndex } as CSSProperties;

  return (
    <section className={styles.preview} aria-label="Interactive claim route">
      <header className={styles.previewHeader}>
        <div>
          <span className={styles.liveDot} aria-hidden="true" />
          Interactive claim route
        </div>
        <span>Fictional preview</span>
      </header>

      <div className={styles.previewBody}>
        <nav className={styles.route} aria-label="Preview a journey stage">
          <span className={styles.routeLine} aria-hidden="true">
            <span className={styles.routeProgress} style={routeStyle} />
          </span>
          {stages.map((stage, index) => (
            <button
              key={stage.id}
              type="button"
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              <span className={styles.routeDot} aria-hidden="true" />
              <span>{stage.label}</span>
            </button>
          ))}
        </nav>

        <div
          key={activeStage.id}
          className={styles.stageCard}
          data-tone={activeStage.tone}
          aria-live="polite"
        >
          <div className={styles.stageCopy}>
            <span>{activeStage.kicker}</span>
            <h2>{activeStage.title}</h2>
            <p>{activeStage.description}</p>
          </div>

          <div className={styles.metricSlip}>
            <div className={styles.slipHandle} aria-hidden="true" />
            <span>{activeStage.metricLabel}</span>
            <strong>{activeStage.metricValue}</strong>
            <small>
              <span aria-hidden="true">✓</span> {activeStage.note}
            </small>
          </div>
        </div>
      </div>

      <footer className={styles.previewFooter}>
        <span>Choose a stage to explore</span>
        <span aria-hidden="true">Click · see · understand</span>
      </footer>
    </section>
  );
}
