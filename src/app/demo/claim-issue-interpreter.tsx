"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  ClaimIssueInterpretation,
  InterpretationResponse,
} from "@/lib/ai/interpreter-model";
import { interpretWithRuleFallback } from "@/lib/ai/rule-fallback-interpreter";
import type { DemoCase } from "@/lib/demo/model";
import { useLocale } from "@/lib/i18n/locale-context";

import styles from "./claim-issue-interpreter.module.css";

type ClaimIssueInterpreterProps = Readonly<{
  demoCase: DemoCase;
  initialRemark?: string;
  onBack: () => void;
  onOpenPreflight?: () => void;
}>;

const PRESET_REMARKS_EN = [
  {
    label: "Bank name mismatch",
    text: "MEMBER NAME IN BANK KYC DOES NOT MATCH WITH UAN RECORD",
  },
  {
    label: "DOB difference > 3 years",
    text: "DATE OF BIRTH MISMATCH (>3 YRS DIFFERENCE). SUBMIT JOINT DECLARATION WITH PROOF",
  },
  {
    label: "Medical certificate missing (Para 68J)",
    text: "MEDICAL CERTIFICATE NOT PRODUCED IN PRESCRIBED FORMAT SIGNED BY RMP (PARA 68J)",
  },
  {
    label: "Service < 5 years (Para 68B)",
    text: "SERVICE LESS THAN 5 YEARS FOR PARA 68B HOUSING ADVANCE",
  },
  {
    label: "Cryptic DA rejection remark",
    text: "CLAIM REJECTED AS PER DA/APFC REMARKS - CONTACT REGIONAL OFFICE",
  },
] as const;

const PRESET_REMARKS_HI = [
  {
    label: "बैंक नाम बेमेल (Mismatch)",
    text: "MEMBER NAME IN BANK KYC DOES NOT MATCH WITH UAN RECORD",
  },
  {
    label: "जन्म तिथि में 3+ वर्ष का अंतर",
    text: "DATE OF BIRTH MISMATCH (>3 YRS DIFFERENCE). SUBMIT JOINT DECLARATION WITH PROOF",
  },
  {
    label: "चिकित्सा प्रमाण पत्र अनुपलब्ध (Para 68J)",
    text: "MEDICAL CERTIFICATE NOT PRODUCED IN PRESCRIBED FORMAT SIGNED BY RMP (PARA 68J)",
  },
  {
    label: "सेवा 5 वर्ष से कम (Para 68B)",
    text: "SERVICE LESS THAN 5 YEARS FOR PARA 68B HOUSING ADVANCE",
  },
  {
    label: "अस्पष्ट DA/APFC रिजेक्शन टिप्पणी",
    text: "CLAIM REJECTED AS PER DA/APFC REMARKS - CONTACT REGIONAL OFFICE",
  },
] as const;

export function ClaimIssueInterpreter({
  demoCase,
  initialRemark,
  onBack,
  onOpenPreflight,
}: ClaimIssueInterpreterProps) {
  const { locale, t } = useLocale();

  const PRESET_REMARKS =
    locale === "hi" ? PRESET_REMARKS_HI : PRESET_REMARKS_EN;

  const defaultText =
    initialRemark ??
    (demoCase.workspace.issue.tone === "attention"
      ? demoCase.workspace.issue.description
      : PRESET_REMARKS[0].text);

  const [remarkText, setRemarkText] = useState(defaultText);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interpretation, setInterpretation] =
    useState<ClaimIssueInterpretation | null>(() =>
      interpretWithRuleFallback({
        rawStatusText: defaultText,
        context: {
          personaId: demoCase.persona.id,
          requestedAmountRupees: demoCase.claim.requestedAmountRupees,
        },
      }),
    );
  const [copied, setCopied] = useState(false);

  async function handleAnalyze() {
    const query = remarkText.trim();
    if (!query) {
      setError(
        locale === "hi"
          ? "कृपया विश्लेषण हेतु पोर्टल टिप्पणी दर्ज करें या चुनें।"
          : "Please enter or select a portal remark to analyze.",
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload = {
      rawStatusText: query,
      context: {
        personaId: demoCase.persona.id,
        claimType: "PF Advance",
        requestedAmountRupees: demoCase.claim.requestedAmountRupees,
      },
    };

    try {
      let result: InterpretationResponse;
      try {
        const response = await fetch("/api/demo/interpret-issue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          result = (await response.json()) as InterpretationResponse;
        } else {
          result = {
            ok: true,
            interpretation: interpretWithRuleFallback(payload),
          };
        }
      } catch {
        result = {
          ok: true,
          interpretation: interpretWithRuleFallback(payload),
        };
      }

      if (result.ok) {
        setInterpretation(result.interpretation);
      } else {
        setInterpretation(interpretWithRuleFallback(payload));
      }
    } catch {
      setError(
        locale === "hi"
          ? "विश्लेषण पूरा करने में असमर्थ। कृपया पुनः प्रयास करें।"
          : "Unable to complete diagnostic interpretation. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleCopySummary() {
    if (!interpretation) return;
    const lines = [
      `ClaimSaathi Rejection Interpretation`,
      `Raw Remark: ${interpretation.rawStatusText}`,
      `Category: ${interpretation.categoryLabel}`,
      `Plain Language: ${interpretation.plainLanguageExplanation}`,
      `Next Action: ${interpretation.citedNextSteps[0]?.step ?? "Review with field office"}`,
    ];
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      navigator.clipboard.writeText(lines.join("\n"));
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <section className={styles.interpreter} aria-labelledby="interpreter-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            {locale === "hi"
              ? "एआई दावा-समस्या इंटरप्रेटर · पारदर्शी विश्लेषण"
              : "OpenAI Claim-Issue Interpreter · Transparent Diagnostics"}
          </p>
          <h2 id="interpreter-title">
            {locale === "hi"
              ? "अस्पष्ट रिजेक्शन टिप्पणी को समझें"
              : "Translate & Resolve Portal Remarks"}
          </h2>
          <span>
            {locale === "hi"
              ? `${demoCase.persona.displayName} के मामले में ईपीएफओ पोर्टल की तकनीकी टिप्पणियों को सरल भाषा में बदलें।`
              : `Convert cryptic rejection codes and portal shorthand into plain-language instructions for ${demoCase.persona.displayName}.`}
          </span>
        </div>
        <Button variant="quiet" onClick={onBack}>
          {locale === "hi" ? "← वर्कस्पेस पर लौटें" : "Back to workspace"}
        </Button>
      </header>

      <Callout
        title={
          locale === "hi"
            ? "काल्पनिक निदान और नियम मार्गदर्शन"
            : "Synthetic Diagnostic & Scheme Guidance"
        }
      >
        {locale === "hi"
          ? "यह इंटरप्रेटर सरकारी पोर्टल की टिप्पणियों को सरल भाषा में समझाता है और ईपीएफओ नियमों के अनुसार अगले कदमों का मार्गदर्शन करता है।"
          : "This interpreter decodes unstructured status text and maps it to verified EPFO scheme guidelines and stakeholder responsibilities."}
      </Callout>

      <div className={styles.bodyGrid}>
        {/* Left Column: Remark input and presets */}
        <section
          className={styles.inputSection}
          aria-labelledby="input-heading"
        >
          <h3 id="input-heading">
            {locale === "hi"
              ? "पोर्टल टिप्पणी दर्ज करें"
              : "Enter or Select Remark"}
          </h3>
          <p className={styles.inputHint}>
            {locale === "hi"
              ? "पोर्टल पर प्रदर्शित वास्तविक या सिम्युलेटेड रिजेक्शन टिप्पणी पेस्ट करें।"
              : "Paste a cryptic EPFO status message or pick a common preset."}
          </p>

          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.textarea}
              rows={4}
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              placeholder={
                locale === "hi"
                  ? "उदा: MEMBER NAME IN BANK KYC DOES NOT MATCH..."
                  : "e.g. MEMBER NAME IN BANK KYC DOES NOT MATCH..."
              }
              aria-label={
                locale === "hi"
                  ? "विश्लेषण हेतु पोर्टल टिप्पणी"
                  : "Portal remark text for analysis"
              }
            />
          </div>

          <div className={styles.presetsWrapper}>
            <span className={styles.presetsLabel}>
              {locale === "hi" ? "त्वरित उदाहरण:" : "Common Presets:"}
            </span>
            <div className={styles.presetButtons}>
              {PRESET_REMARKS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className={styles.presetChip}
                  onClick={() => setRemarkText(preset.text)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <div role="alert" className={styles.errorAlert}>
              {error}
            </div>
          ) : null}

          <div className={styles.actions}>
            <Button
              onClick={handleAnalyze}
              disabled={isLoading}
              className={styles.analyzeBtn}
            >
              {isLoading
                ? t.common.loading
                : locale === "hi"
                  ? "टिप्पणी का विश्लेषण करें →"
                  : "Analyze Remark with AI →"}
            </Button>
          </div>
        </section>

        {/* Right Column: Diagnostic output card */}
        {interpretation ? (
          <section
            className={styles.outputSection}
            aria-labelledby="output-heading"
          >
            <div className={styles.outputHeader}>
              <div>
                <span className={styles.categoryTag}>
                  {interpretation.categoryLabel}
                </span>
                <h3 id="output-heading">
                  {locale === "hi" ? "समस्या का निदान" : "Diagnostic Breakdown"}
                </h3>
              </div>
              <StatusBadge
                tone={
                  interpretation.severity === "blocker"
                    ? "critical"
                    : interpretation.severity === "warning"
                      ? "warning"
                      : "info"
                }
              >
                {interpretation.severity === "blocker"
                  ? locale === "hi"
                    ? "बाधक (Blocker)"
                    : "Blocker"
                  : interpretation.severity === "warning"
                    ? locale === "hi"
                      ? "चेतावनी"
                      : "Warning"
                    : locale === "hi"
                      ? "सूचना"
                      : "Informational"}
              </StatusBadge>
            </div>

            <div className={styles.plainExplanation}>
              <h4>
                {locale === "hi"
                  ? "सरल भाषा में अर्थ"
                  : "What this actually means"}
              </h4>
              <p>{interpretation.plainLanguageExplanation}</p>
            </div>

            <div className={styles.rootCause}>
              <strong>{locale === "hi" ? "मूल कारण: " : "Root Cause: "}</strong>
              <span>{interpretation.rootCause}</span>
            </div>

            {/* Structured Next Steps */}
            <div className={styles.nextSteps}>
              <h4>
                {locale === "hi" ? "अनुशंसित कदम" : "Recommended Next Steps"}
              </h4>
              <ol className={styles.stepsList}>
                {interpretation.citedNextSteps.map((step) => (
                  <li key={step.order}>
                    <div className={styles.stepHeader}>
                      <span className={styles.stepNum}>{step.order}</span>
                      <strong>{step.step}</strong>
                      <span className={styles.ownerBadge}>{step.owner}</span>
                    </div>
                    {step.officialRuleCitation ? (
                      <p className={styles.citationText}>
                        📜 {step.officialRuleCitation}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>

            {/* Action Bar */}
            <div className={styles.outputActions}>
              <Button
                variant="secondary"
                onClick={handleCopySummary}
                className={styles.copyBtn}
                aria-live="polite"
              >
                {copied
                  ? t.common.copied
                  : locale === "hi"
                    ? "सारांश कॉपी करें"
                    : "Copy Diagnostic Summary"}
              </Button>
              {onOpenPreflight ? (
                <Button onClick={onOpenPreflight}>
                  {locale === "hi"
                    ? "केवाईसी प्री-फ्लाइट जांचें चलाएं →"
                    : "Open KYC Preflight Checks →"}
                </Button>
              ) : null}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}
