"use client";

import { useState, type CSSProperties } from "react";

import { useLocale } from "@/lib/i18n/locale-context";

import styles from "./journey-preview.module.css";

const stagesEn = [
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

const stagesHi = [
  {
    id: "plan",
    label: "योजना",
    kicker: "शुरू करने से पहले",
    title: "आंकड़ों और नियमों का सही अर्थ समझें।",
    description:
      "पात्र राशि, सुरक्षित रखी गई पेंशन राशि और लागू ईपीएफ नियमों को स्पष्ट देखें।",
    metricLabel: "काल्पनिक पात्र राशि",
    metricValue: "₹75,000",
    note: "पेंशन हिस्सा अलग दर्शाया गया",
    tone: "violet",
  },
  {
    id: "prepare",
    label: "तैयारी",
    kicker: "आवेदन प्रस्तुत करने से पहले",
    title: "रुकावटों को पहले ही दूर करें।",
    description:
      "पहचान, बैंक और दस्तावेज जांच उन कमियों को दर्शाती है जिन्हें समय पर सुधारा जा सकता है।",
    metricLabel: "तैयारी जांच",
    metricValue: "4 / 5 सफल",
    note: "एक बैंक नाम जांच पर ध्यान देने की आवश्यकता",
    tone: "amber",
  },
  {
    id: "track",
    label: "ट्रैक करें",
    kicker: "आवेदन के बाद",
    title: "हर स्थिति से एक स्पष्ट कदम तय होता है।",
    description:
      "हर अपडेट बताता है कि कब प्रतीक्षा करनी है, नियोक्ता से संपर्क करना है या साक्ष्य जुटाना है।",
    metricLabel: "वर्तमान स्थिति",
    metricValue: "समीक्षाधीन (Under Review)",
    note: "अंतिम सिम्युलेटेड अपडेट: आज",
    tone: "blue",
  },
  {
    id: "recover",
    label: "सुधार",
    kicker: "यदि कुछ गलत हो जाए",
    title: "रिजेक्शन अंत नहीं है।",
    description:
      "कारण, सुधार चेकलिस्ट, साक्ष्य और शिकायत मार्ग को एक ही स्थान पर जोड़ें।",
    metricLabel: "जिम्मेदारी",
    metricValue: "नागरिक (Citizen)",
    note: "सरल भाषा में सुधार समाधान उपलब्ध",
    tone: "green",
  },
] as const;

export function JourneyPreview() {
  const { locale } = useLocale();
  const stages = locale === "hi" ? stagesHi : stagesEn;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStage = stages[activeIndex] ?? stages[0];
  const routeStyle = { "--active-step": activeIndex } as CSSProperties;

  return (
    <section
      className={styles.preview}
      aria-label={
        locale === "hi" ? "इंटरैक्टिव दावा मार्ग" : "Interactive claim route"
      }
    >
      <header className={styles.previewHeader}>
        <div>
          <span className={styles.liveDot} aria-hidden="true" />
          {locale === "hi"
            ? "इंटरैक्टिव दावा मार्ग"
            : "Interactive claim route"}
        </div>
        <span>
          {locale === "hi" ? "काल्पनिक पूर्वावलोकन" : "Fictional preview"}
        </span>
      </header>

      <div className={styles.previewBody}>
        <nav
          className={styles.route}
          aria-label={
            locale === "hi"
              ? "यात्रा के चरण का पूर्वावलोकन करें"
              : "Preview a journey stage"
          }
        >
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

          <aside
            className={styles.stageMetric}
            aria-label={activeStage.metricLabel}
          >
            <span>{activeStage.metricLabel}</span>
            <strong>{activeStage.metricValue}</strong>
            <small>{activeStage.note}</small>
          </aside>
        </div>
      </div>
    </section>
  );
}
