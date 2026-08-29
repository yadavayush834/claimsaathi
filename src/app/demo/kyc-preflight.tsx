"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  DemoCase,
  DemoPreflightCategory,
  DemoPreflightCheck,
} from "@/lib/demo/model";
import { runDemoPreflight } from "@/lib/preflight/demo-preflight";
import { useLocale } from "@/lib/i18n/locale-context";

import styles from "./kyc-preflight.module.css";

type KycPreflightProps = Readonly<{
  demoCase: DemoCase;
  onBack: () => void;
}>;

const categoryLabelsEn: Record<DemoPreflightCategory, string> = {
  identity: "Identity",
  bank: "Bank",
  evidence: "Evidence",
};

const categoryLabelsHi: Record<DemoPreflightCategory, string> = {
  identity: "पहचान",
  bank: "बैंक",
  evidence: "दस्तावेज",
};

function getEffectiveStatus(
  check: DemoPreflightCheck,
  resolvedIds: Set<string>,
) {
  return resolvedIds.has(check.id) ? "ready" : check.status;
}

export function KycPreflight({ demoCase, onBack }: KycPreflightProps) {
  const { locale } = useLocale();
  const preflight = useMemo(
    () => runDemoPreflight(demoCase.workspace.preflight),
    [demoCase.workspace.preflight],
  );
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(() => new Set());
  const firstActionCheck = preflight.checks.find(
    (check) => check.status === "action_needed",
  );
  const [selectedCheckId, setSelectedCheckId] = useState(
    firstActionCheck?.id ?? preflight.checks[0]?.id ?? "",
  );
  const [isConfirmed, setIsConfirmed] = useState(false);

  const categoryLabels = locale === "hi" ? categoryLabelsHi : categoryLabelsEn;

  const effectiveChecks = preflight.checks.map((check) => ({
    check,
    status: getEffectiveStatus(check, resolvedIds),
  }));
  const remainingChecks = effectiveChecks.filter(
    ({ status }) => status === "action_needed",
  );
  const selected =
    effectiveChecks.find(({ check }) => check.id === selectedCheckId) ??
    effectiveChecks[0];

  function selectCheck(checkId: string) {
    setSelectedCheckId(checkId);
    setIsConfirmed(false);
  }

  function markSelectedReady() {
    if (!selected || selected.status !== "action_needed" || !isConfirmed) {
      return;
    }

    const nextResolved = new Set(resolvedIds);
    nextResolved.add(selected.check.id);
    setResolvedIds(nextResolved);
    setIsConfirmed(false);

    const nextAction = effectiveChecks.find(
      ({ check, status }) =>
        check.id !== selected.check.id && status === "action_needed",
    );

    if (nextAction) {
      setSelectedCheckId(nextAction.check.id);
    }
  }

  const completedCount = effectiveChecks.length - remainingChecks.length;
  const isComplete = remainingChecks.length === 0;
  const selectedWasResolved = Boolean(
    selected && resolvedIds.has(selected.check.id),
  );

  return (
    <section className={styles.preflight} aria-labelledby="preflight-title">
      <header className={styles.header}>
        <div>
          <p>
            {locale === "hi"
              ? "काल्पनिक तैयारी प्री-फ्लाइट · कोई वास्तविक सबमिशन नहीं"
              : "Fictional readiness preflight · no submission"}
          </p>
          <h2 id="preflight-title">
            {locale === "hi"
              ? "जांचें कि पहले क्या सुधारना आवश्यक है"
              : "Check what needs fixing first"}
          </h2>
          <span>
            {locale === "hi"
              ? `${demoCase.persona.displayName} का काल्पनिक केस`
              : `${demoCase.persona.displayName}'s synthetic case`}
          </span>
        </div>
        <Button variant="quiet" onClick={onBack}>
          {locale === "hi" ? "← वर्कस्पेस पर लौटें" : "Back to workspace"}
        </Button>
      </header>

      <Callout
        title={
          locale === "hi" ? "केवल काल्पनिक रिकॉर्ड" : "Synthetic records only"
        }
      >
        {locale === "hi"
          ? "ये तुलनाएं स्थानीय काल्पनिक रिकॉर्ड का उपयोग करती हैं। यहां कभी भी असली पहचान या बैंक विवरण दर्ज न करें।"
          : "These comparisons use local fictional records. Do not enter, upload, or correct real identity, bank, or medical information here."}
      </Callout>

      <section className={styles.summary} aria-labelledby="preflight-summary">
        <div className={styles.summaryNumber} aria-hidden="true">
          <span>{isComplete ? "✓" : remainingChecks.length}</span>
          <small>
            {isComplete
              ? locale === "hi"
                ? "तैयार"
                : "ready"
              : locale === "hi"
                ? "सुधार बाकी"
                : "to fix"}
          </small>
        </div>
        <div>
          <p>{locale === "hi" ? "प्री-फ्लाइट परिणाम" : "Preflight result"}</p>
          <h3 id="preflight-summary">
            {isComplete
              ? locale === "hi"
                ? "यह काल्पनिक केस अगले चरण के लिए पूरी तरह तैयार है।"
                : "This fictional case is ready for its next step."
              : locale === "hi"
                ? `${remainingChecks.length} काल्पनिक रिकॉर्ड पर ध्यान देने की आवश्यकता है।`
                : `${remainingChecks.length} fictional records need attention.`}
          </h3>
          <span>
            {locale === "hi"
              ? `इस ब्राउज़र में ${effectiveChecks.length} में से ${completedCount} तैयारी जांचें पूरी हो गई हैं।`
              : `${completedCount} of ${effectiveChecks.length} readiness checks are clear in this browser.`}
          </span>
        </div>
        <div
          className={styles.summaryMeter}
          aria-label={
            locale === "hi" ? "प्री-फ्लाइट प्रगति" : "Preflight progress"
          }
        >
          <span
            style={{
              width: `${(completedCount / effectiveChecks.length) * 100}%`,
            }}
          />
        </div>
      </section>

      <div className={styles.preflightGrid}>
        <nav
          className={styles.checkRail}
          aria-label={locale === "hi" ? "तैयारी जांचें" : "Readiness checks"}
        >
          <div className={styles.railHeading}>
            <p>{locale === "hi" ? "जांच रिकॉर्ड" : "Check records"}</p>
            <span>
              {locale === "hi"
                ? "समीक्षा हेतु एक चुनें"
                : "Choose one to review"}
            </span>
          </div>
          <ol>
            {effectiveChecks.map(({ check, status }, index) => (
              <li key={check.id} data-status={status}>
                <button
                  type="button"
                  aria-current={
                    selected?.check.id === check.id ? "step" : undefined
                  }
                  aria-label={
                    locale === "hi"
                      ? `${categoryLabels[check.category]} जांचें: ${check.label}`
                      : `Review ${categoryLabels[check.category]}: ${check.label}`
                  }
                  onClick={() => selectCheck(check.id)}
                >
                  <span className={styles.checkNumber} aria-hidden="true">
                    {status === "ready"
                      ? "✓"
                      : String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <small>{categoryLabels[check.category]}</small>
                    <strong>{check.label}</strong>
                  </span>
                  <StatusBadge
                    tone={status === "ready" ? "success" : "critical"}
                  >
                    {status === "ready"
                      ? locale === "hi"
                        ? "सफल"
                        : "Clear"
                      : locale === "hi"
                        ? "सुधारें"
                        : "Fix"}
                  </StatusBadge>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {selected ? (
          <section
            className={styles.reviewPanel}
            data-status={selected.status}
            aria-labelledby="selected-check-title"
          >
            <header className={styles.reviewHeader}>
              <div>
                <p>
                  {categoryLabels[selected.check.category]}{" "}
                  {locale === "hi" ? "रिकॉर्ड" : "record"}
                </p>
                <h3 id="selected-check-title">{selected.check.label}</h3>
              </div>
              <StatusBadge
                tone={selected.status === "ready" ? "success" : "critical"}
              >
                {selected.status === "ready"
                  ? locale === "hi"
                    ? "डेमो में तैयार"
                    : "Ready in demo"
                  : locale === "hi"
                    ? "कार्रवाई आवश्यक"
                    : "Action needed"}
              </StatusBadge>
            </header>

            <p className={styles.reviewSummary}>
              {selectedWasResolved
                ? locale === "hi"
                  ? "आपने इस काल्पनिक सुधार को इस ब्राउज़र में तैयार चिह्नित किया है। संदर्भ हेतु मूल तुलना नीचे बनी हुई है।"
                  : "You marked this fictional correction ready in this browser. The original comparison remains below for context."
                : selected.check.summary}
            </p>

            <section
              className={styles.comparison}
              aria-labelledby="comparison-title"
            >
              <p id="comparison-title">
                {locale === "hi"
                  ? "काल्पनिक जांच ने क्या तुलना की"
                  : "What the fictional check compared"}
              </p>
              <dl>
                {selected.check.comparedRecords.map((record) => (
                  <div key={record.label}>
                    <dt>{record.label}</dt>
                    <dd>{record.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {selected.status === "action_needed" ? (
              <section
                className={styles.correction}
                aria-labelledby="owner-title"
              >
                <div className={styles.ownerLine}>
                  <div>
                    <p id="owner-title">
                      {locale === "hi"
                        ? "सुधार का दायित्व"
                        : "Who can fix this"}
                    </p>
                    <strong>{selected.check.ownerLabel}</strong>
                  </div>
                  <span aria-hidden="true">→</span>
                </div>
                <h4>{selected.check.actionLabel}</h4>
                <ol>
                  {selected.check.correctionSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <label className={styles.confirmation}>
                  <input
                    type="checkbox"
                    checked={isConfirmed}
                    onChange={(event) => setIsConfirmed(event.target.checked)}
                  />
                  <span>
                    {locale === "hi"
                      ? "मैंने इस डेमो के लिए ये काल्पनिक सुधारात्मक कदम पूरे कर लिए हैं।"
                      : "I completed these fictional correction steps for this demo."}
                  </span>
                </label>
                <Button disabled={!isConfirmed} onClick={markSelectedReady}>
                  {locale === "hi"
                    ? "इस जांच को तैयार चिह्नित करें"
                    : "Mark this check ready"}
                </Button>
              </section>
            ) : (
              <div className={styles.clearPanel}>
                <span aria-hidden="true">✓</span>
                <div>
                  <strong>
                    {locale === "hi"
                      ? "इस डेमो में किसी सुधार की आवश्यकता नहीं है।"
                      : "No correction is needed in this demo."}
                  </strong>
                  <p>
                    {locale === "hi"
                      ? "यह स्थिति सिम्युलेटेड सुधार को दर्शाती है; यह ऊपर दिखाए गए काल्पनिक रिकॉर्ड को नहीं बदलती।"
                      : "This local status reflects the simulated correction; it does not alter the fictional source records shown above."}
                  </p>
                </div>
              </div>
            )}
          </section>
        ) : null}
      </div>

      {isComplete ? (
        <section className={styles.complete} aria-live="polite">
          <span aria-hidden="true">✓</span>
          <div>
            <p>
              {locale === "hi" ? "प्री-फ्लाइट पूर्ण" : "Preflight complete"}
            </p>
            <h3>
              {locale === "hi"
                ? "सभी काल्पनिक तैयारी जांचें सफल रहीं।"
                : "All three fictional readiness checks are clear."}
            </h3>
            <span>
              {locale === "hi"
                ? "यह केस अब अगले चरण पर आगे बढ़ने के लिए तैयार है।"
                : "The next mock claim form is intentionally not available until a later phase of this prototype."}
            </span>
          </div>
          <Button variant="secondary" onClick={onBack}>
            {locale === "hi" ? "वर्कस्पेस पर लौटें" : "Return to workspace"}
          </Button>
        </section>
      ) : null}
    </section>
  );
}
