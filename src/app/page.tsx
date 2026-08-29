"use client";

import { AppShell } from "@/components/layout/app-shell";
import { ActionLink } from "@/components/ui/action-link";
import { useLocale } from "@/lib/i18n/locale-context";

import { JourneyPreview } from "./journey-preview";
import styles from "./page.module.css";

export default function HomePage() {
  const { t, locale } = useLocale();

  const journeyMoments =
    locale === "hi"
      ? [
          {
            number: "01",
            label: "दावा करने से पहले",
            title: "वास्तविक आंकड़ों को सामने रखकर योजना बनाएं।",
            description:
              "फॉर्म भरने से पहले अपनी पात्र राशि, सुरक्षित पेंशन हिस्सा और प्री-फ्लाइट जांचों को समझें।",
            outcome: "अचानक होने वाली परेशानियों से मुक्ति",
          },
          {
            number: "02",
            label: "प्रक्रिया के दौरान",
            title: "हर स्थिति को एक स्पष्ट कार्रवाई में बदलें।",
            description:
              "पोर्टल के संक्षिप्त कोड्स को समझने में समय गंवाए बिना सीधे जानें कि आगे क्या करना है।",
            outcome: "एक स्पष्ट अगला कदम",
          },
          {
            number: "03",
            label: "समस्या होने पर",
            title: "बिना शून्य से शुरू किए सीधे समाधान पाएं।",
            description:
              "रिजेक्शन का कारण, जिम्मेदार व्यक्ति, सुधार चेकलिस्ट और शिकायत याचिका को एक साथ जोड़ें।",
            outcome: "कोई भ्रम या निराशा नहीं",
          },
        ]
      : [
          {
            number: "01",
            label: "Before the claim",
            title: "Plan with the real numbers in view.",
            description:
              "Understand the mock eligible amount, what stays protected, and which readiness check needs attention before filling a form.",
            outcome: "Fewer late surprises",
          },
          {
            number: "02",
            label: "While it moves",
            title: "Turn every status into an instruction.",
            description:
              "See whether to wait, correct a detail, contact an employer, or gather evidence—without translating portal shorthand yourself.",
            outcome: "One clear next action",
          },
          {
            number: "03",
            label: "When it goes wrong",
            title: "Recover without starting from zero.",
            description:
              "Keep the reason, responsible person, correction checklist, and grievance path connected to the same fictional claim.",
            outcome: "No dead-end rejection",
          },
        ];

  const safetyRows =
    locale === "hi"
      ? [
          [
            "डेमो में उपयोग",
            "काल्पनिक व्यक्ति, शेष राशि, दस्तावेज, ओटीपी और घटनाएं",
          ],
          [
            "आपको कभी नहीं दर्ज करना है",
            "असली आधार, पैन, यूएएन, बैंक या लॉगिन विवरण",
          ],
          [
            "प्रोटोटाइप क्या नहीं कर सकता",
            "दावा दायर करना, पैसे ट्रांसफर करना या ईपीएफओ से संपर्क",
          ],
        ]
      : [
          [
            "The demo uses",
            "Fictional people, balances, documents, OTPs and events",
          ],
          [
            "You should never enter",
            "Real Aadhaar, PAN, UAN, bank or login details",
          ],
          ["The prototype cannot", "File a claim, move money or contact EPFO"],
        ];

  return (
    <AppShell currentStep={1}>
      <div className={styles.page}>
        <section className={styles.hero} aria-labelledby="page-title">
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <span aria-hidden="true">CS</span>
              {t.landing.heroPill}
            </div>
            <h1 id="page-title">{t.landing.heroHeading}</h1>
            <p className={styles.heroLede}>{t.landing.heroLead}</p>
            <div className={styles.heroActions}>
              <ActionLink href="/demo" className={styles.primaryAction}>
                {t.landing.exploreDemoCta}
              </ActionLink>
              <ActionLink
                href="#how-it-works"
                variant="secondary"
                className={styles.secondaryAction}
              >
                {t.landing.seeHowItWorksCta}
              </ActionLink>
            </div>
            <p className={styles.heroNote}>
              <span aria-hidden="true">✓</span>{" "}
              {locale === "hi"
                ? "काल्पनिक डेटा के साथ तुरंत खुलता है। कोई लॉगिन या सरकारी संबंध नहीं।"
                : "Opens instantly with fictional data. No login or government connection."}
            </p>
          </div>

          <JourneyPreview />
        </section>

        <section
          className={styles.trustRail}
          aria-label={
            locale === "hi" ? "डेमो सुरक्षा सीमाएं" : "Demo boundaries"
          }
        >
          <div>
            <span className={styles.trustIcon} aria-hidden="true">
              ↗
            </span>
            <p>
              <strong>{t.landing.stat2Value}</strong>
              {t.landing.stat2Label}
            </p>
          </div>
          <div>
            <span className={styles.trustIcon} aria-hidden="true">
              ◎
            </span>
            <p>
              <strong>{t.landing.stat1Value}</strong>
              {t.landing.stat1Label}
            </p>
          </div>
          <div>
            <span className={styles.trustIcon} aria-hidden="true">
              ⌁
            </span>
            <p>
              <strong>{t.landing.stat3Value}</strong>
              {t.landing.stat3Label}
            </p>
          </div>
        </section>

        <section
          className={styles.howSection}
          id="how-it-works"
          aria-labelledby="how-title"
        >
          <div className={styles.sectionIntro}>
            <p className={styles.sectionKicker}>
              {locale === "hi" ? "एक एकीकृत मार्ग" : "One connected route"}
            </p>
            <h2 id="how-title">{t.landing.howItWorksHeading}</h2>
            <p>{t.landing.howItWorksSub}</p>
          </div>

          <div className={styles.momentList}>
            {journeyMoments.map((moment) => (
              <article key={moment.number} className={styles.moment}>
                <div className={styles.momentNumber}>{moment.number}</div>
                <div className={styles.momentCopy}>
                  <span>{moment.label}</span>
                  <h3>{moment.title}</h3>
                  <p>{moment.description}</p>
                </div>
                <div className={styles.momentOutcome}>
                  <span aria-hidden="true">✓</span>
                  {moment.outcome}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className={styles.safety}
          id="safety"
          aria-labelledby="safety-title"
        >
          <div className={styles.safetyCopy}>
            <p className={styles.sectionKicker}>
              {locale === "hi"
                ? "स्पष्ट सुरक्षा सीमा"
                : "Clear safety boundary"}
            </p>
            <h2 id="safety-title">{t.landing.safetyHeading}</h2>
            <p>{t.landing.safetySub}</p>
            <ActionLink href="/demo" className={styles.safetyAction}>
              {t.landing.exploreDemoCta}
            </ActionLink>
          </div>

          <div className={styles.safetySheet}>
            <div className={styles.sheetTop}>
              <span>
                {locale === "hi" ? "प्रोटोटाइप सीमा" : "Prototype boundary"}
              </span>
              <strong>
                {locale === "hi" ? "सदैव दृश्यमान" : "Always visible"}
              </strong>
            </div>
            <dl>
              {safetyRows.map(([term, description]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.sheetFoot}>
              <span aria-hidden="true">i</span>
              {locale === "hi"
                ? "पूरी यात्रा के दौरान सिम्युलेटेड व्यवहार को स्पष्ट रूप से चिह्नित किया गया है।"
                : "Mocked behavior is labelled throughout the journey."}
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
