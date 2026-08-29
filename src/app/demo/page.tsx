"use client";

import { AppShell } from "@/components/layout/app-shell";
import { ActionLink } from "@/components/ui/action-link";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";
import { useLocale } from "@/lib/i18n/locale-context";

import { DemoSessionManager } from "./demo-session-manager";
import styles from "./demo.module.css";

export default function DemoPage() {
  const { locale } = useLocale();

  const demoChecks =
    locale === "hi"
      ? [
          ["खाता / लॉगिन", "आवश्यक नहीं"],
          ["व्यक्तिगत डेटा", "कभी नहीं मांगा जाता"],
          ["सरकारी संबंध", "शून्य (पूरी तरह स्वतंत्र)"],
          ["सत्र पुनःप्राप्ति", "केवल इस ब्राउज़र में"],
        ]
      : [
          ["Account", "Not required"],
          ["Personal data", "Not requested"],
          ["Government connection", "None"],
          ["Session recovery", "This browser only"],
        ];

  return (
    <AppShell currentStep={1}>
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.introCopy}>
            <div className={styles.badgeRow}>
              <StatusBadge tone="success">
                {locale === "hi"
                  ? "लॉगिन की आवश्यकता नहीं"
                  : "No login required"}
              </StatusBadge>
              <span className={styles.modeChip}>
                {locale === "hi" ? "सुरक्षित सैंडबॉक्स" : "Safe sandbox"}
              </span>
            </div>
            <h1>
              {locale === "hi"
                ? "आप डेमो मोड में हैं।"
                : "You're in demo mode."}
            </h1>
            <p className={styles.lede}>
              {locale === "hi"
                ? "एक काल्पनिक नागरिक केस चुनें और उनके दृष्टिकोण से पूरी निकासी यात्रा का अनुभव करें। कोई भी विवरण सरकारी प्रणाली से नहीं जुड़ता।"
                : "Choose a fictional citizen and experience the withdrawal journey from their point of view. Nothing connects to a government system."}
            </p>
          </div>
          <div className={styles.demoStamp} aria-hidden="true">
            <span>
              {locale === "hi" ? "समीक्षक यात्रा" : "Reviewer journey"}
            </span>
            <strong>DEMO</strong>
            <small>
              {locale === "hi"
                ? "काल्पनिक डेटा · स्थानीय ब्राउज़र सत्र"
                : "Fictional data · local browser session"}
            </small>
          </div>
        </header>

        <div className={styles.calloutWrap}>
          <Callout
            title={
              locale === "hi"
                ? "केवल काल्पनिक डेटा (Synthetic data only)"
                : "Synthetic data only"
            }
          >
            {locale === "hi"
              ? "नीचे दिया गया प्रत्येक नागरिक, शेष राशि, दावा संदर्भ और घटना एक स्थानीय संस्करणबद्ध फिक्सचर से आती है। यह किसी वास्तविक सदस्य या दावे को नहीं खोजता।"
              : "Every citizen, amount, claim reference, and event below comes from a versioned local fixture. It cannot look up a real member or claim."}
          </Callout>
        </div>

        <DemoSessionManager />

        <div className={styles.checksWrapper}>
          <div className={styles.checksHeading}>
            <p className={styles.checksTitle}>
              {locale === "hi" ? "डेमो सुरक्षा गारंटी" : "Demo guarantees"}
            </p>
            <span>
              {locale === "hi"
                ? "ये सीमाएं पूरी यात्रा के दौरान सक्रिय रहती हैं।"
                : "These boundaries remain active throughout the journey."}
            </span>
          </div>
          <dl className={styles.checks}>
            {demoChecks.map(([term, description]) => (
              <div key={term} className={styles.checkCard}>
                <dt>
                  <span className={styles.checkIcon} aria-hidden="true">
                    ✓
                  </span>
                  {term}
                </dt>
                <dd>{description}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ActionLink href="/" variant="secondary" className={styles.backBtn}>
          {locale === "hi" ? "← मुख्य पृष्ठ पर लौटें" : "← Return to overview"}
        </ActionLink>
      </div>
    </AppShell>
  );
}
