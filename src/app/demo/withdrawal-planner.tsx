"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { ExternalCitationLink } from "@/components/ui/external-citation-link";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";
import { TextField } from "@/components/ui/text-field";
import {
  calculateMockEligibility,
  type EligibilityResult,
} from "@/lib/eligibility/calculator";
import {
  ELIGIBILITY_POLICY_SOURCE_URL,
  getPurposePolicy,
  WITHDRAWAL_PURPOSES,
  type WithdrawalPurpose,
} from "@/lib/eligibility/policy";
import type { DemoCase } from "@/lib/demo/model";
import { useLocale } from "@/lib/i18n/locale-context";

import styles from "./withdrawal-planner.module.css";

type WithdrawalPlannerProps = Readonly<{
  demoCase: DemoCase;
  onBack: () => void;
  onStartMockClaim: () => void;
}>;

type PlannerStep = 1 | 2 | 3 | 4;

const plannerStepsEn = ["Goal", "Details", "Amount", "Result"] as const;
const plannerStepsHi = ["उद्देश्य", "विवरण", "राशि", "परिणाम"] as const;

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function parseWholeNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.floor(parsed) : Number.NaN;
}

export function WithdrawalPlanner({
  demoCase,
  onBack,
  onStartMockClaim,
}: WithdrawalPlannerProps) {
  const { locale, t } = useLocale();
  const [step, setStep] = useState<PlannerStep>(1);
  const [purpose, setPurpose] = useState<WithdrawalPurpose>("medical");
  const [serviceMonths, setServiceMonths] = useState("36");
  const [previousWithdrawals, setPreviousWithdrawals] = useState("0");
  const [amountNeeded, setAmountNeeded] = useState(
    String(demoCase.claim.requestedAmountRupees),
  );
  const [serviceError, setServiceError] = useState<string>();
  const [amountError, setAmountError] = useState<string>();

  const purposePolicy = getPurposePolicy(purpose);
  const contributionBalance =
    demoCase.workspace.balance.employeeShareRupees +
    demoCase.workspace.balance.employerShareRupees;

  const plannerSteps = locale === "hi" ? plannerStepsHi : plannerStepsEn;

  function continueFromGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStep(2);
  }

  function continueFromDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const months = parseWholeNumber(serviceMonths);

    if (months < 0 || months > 600 || !Number.isFinite(months)) {
      setServiceError(
        locale === "hi"
          ? "0 से 600 महीनों के बीच सेवा अवधि दर्ज करें।"
          : "Enter synthetic service between 0 and 600 months.",
      );
      return;
    }

    setServiceError(undefined);
    setStep(3);
  }

  function calculateResult(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = parseWholeNumber(amountNeeded);

    if (amount <= 0 || amount > 10000000 || !Number.isFinite(amount)) {
      setAmountError(
        locale === "hi"
          ? "₹1 से ₹1,00,00,000 तक की राशि दर्ज करें।"
          : "Enter a synthetic amount from ₹1 to ₹1,00,00,000.",
      );
      return;
    }

    setAmountError(undefined);
    setStep(4);
  }

  const result: EligibilityResult = calculateMockEligibility({
    purpose,
    totalServiceMonths: parseWholeNumber(serviceMonths),
    previousWithdrawals: parseWholeNumber(previousWithdrawals),
    amountNeededRupees: parseWholeNumber(amountNeeded),
    employeeShareRupees: demoCase.workspace.balance.employeeShareRupees,
    employerShareRupees: demoCase.workspace.balance.employerShareRupees,
    pensionShareRupees: demoCase.workspace.balance.pensionShareRupees,
  });

  return (
    <section className={styles.planner} aria-labelledby="planner-title">
      <header className={styles.header}>
        <div>
          <p>
            {locale === "hi"
              ? "काल्पनिक योजना टूल · कोई सबमिशन नहीं"
              : "Fictional planning tool · no submission"}
          </p>
          <h2 id="planner-title">
            {locale === "hi"
              ? "मॉक पीएफ निकासी की योजना बनाएं"
              : "Plan a mock PF withdrawal"}
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

      <nav
        className={styles.progress}
        aria-label={locale === "hi" ? "योजना प्रगति" : "Planning progress"}
      >
        <ol>
          {plannerSteps.map((label, index) => {
            const stepNumber = (index + 1) as PlannerStep;
            return (
              <li
                key={label}
                data-state={
                  stepNumber < step
                    ? "complete"
                    : stepNumber === step
                      ? "current"
                      : "upcoming"
                }
              >
                <span aria-hidden="true">{stepNumber}</span>
                <strong aria-current={stepNumber === step ? "step" : undefined}>
                  {label}
                </strong>
              </li>
            );
          })}
        </ol>
      </nav>

      <Callout
        title={
          locale === "hi"
            ? "केवल काल्पनिक उत्तरों का उपयोग करें"
            : "Use fictional answers only"
        }
      >
        {locale === "hi"
          ? "यह टूल ईपीएफओ नीति स्नैपशॉट से अनुमानित राशि की गणना करता है। यह किसी वास्तविक खाते की जांच नहीं करता।"
          : "This tool estimates a mock amount from a published policy snapshot. It does not check a real EPFO account or confirm entitlement."}
      </Callout>

      {step === 1 ? (
        <form className={styles.step} onSubmit={continueFromGoal}>
          <div className={styles.stepHeading}>
            <p>{locale === "hi" ? "प्रश्न 1 / 3" : "Question 1 of 3"}</p>
            <h3>
              {locale === "hi"
                ? "निकासी किस उद्देश्य के लिए है?"
                : "What is the withdrawal for?"}
            </h3>
            <span>
              {locale === "hi"
                ? "इस गणना हेतु एक उद्देश्य चुनें।"
                : "Choose one fictional need for this calculation."}
            </span>
          </div>

          <fieldset className={styles.purposeFieldset}>
            <legend>
              {locale === "hi" ? "निकासी का उद्देश्य" : "Withdrawal purpose"}
            </legend>
            {WITHDRAWAL_PURPOSES.map((item) => (
              <label key={item.id}>
                <input
                  type="radio"
                  name="withdrawal-purpose"
                  value={item.id}
                  aria-label={item.label}
                  checked={purpose === item.id}
                  onChange={() => {
                    setPurpose(item.id);
                    setPreviousWithdrawals("0");
                  }}
                />
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
              </label>
            ))}
          </fieldset>

          <div className={styles.actions}>
            <Button type="submit">
              {locale === "hi" ? "विवरण पर आगे बढ़ें" : "Continue to details"}
            </Button>
          </div>
        </form>
      ) : null}

      {step === 2 ? (
        <form className={styles.step} onSubmit={continueFromDetails}>
          <div className={styles.stepHeading}>
            <p>{locale === "hi" ? "प्रश्न 2 / 3" : "Question 2 of 3"}</p>
            <h3>
              {locale === "hi"
                ? "क्या यह केस बुनियादी सेवा शर्तों को पूरा करता है?"
                : "Does this fictional case meet the basic checks?"}
            </h3>
            <span>
              {locale === "hi"
                ? `डेमो कुल सेवा और पूर्व ${purposePolicy.label.toLowerCase()} निकासियों की जांच करता है।`
                : `The demo checks total service and prior ${purposePolicy.label.toLowerCase()} withdrawals.`}
            </span>
          </div>

          <div className={styles.fieldGrid}>
            <TextField
              id="synthetic-service-months"
              label={
                locale === "hi"
                  ? "महीनों में कुल सेवा अवधि"
                  : "Total service in months"
              }
              hint={
                locale === "hi"
                  ? "काल्पनिक मान। डेमो में न्यूनतम 12 महीने आवश्यक हैं।"
                  : "Synthetic value only. The demo minimum is 12 months."
              }
              error={serviceError}
              type="number"
              inputMode="numeric"
              min="0"
              max="600"
              required
              value={serviceMonths}
              onChange={(event) => setServiceMonths(event.target.value)}
            />

            <div className={styles.selectField}>
              <label htmlFor="previous-withdrawals">
                {locale === "hi"
                  ? `पूर्व ${purposePolicy.label} निकासियां`
                  : `Previous ${purposePolicy.label.toLowerCase()} withdrawals`}
              </label>
              <span id="previous-withdrawals-hint">
                {locale === "hi"
                  ? `डेमो सीमा: ${purposePolicy.frequencyLimit} ${purposePolicy.frequencyWindow}`
                  : `Demo limit: ${purposePolicy.frequencyLimit} ${purposePolicy.frequencyWindow}.`}
              </span>
              <select
                id="previous-withdrawals"
                aria-describedby="previous-withdrawals-hint"
                value={previousWithdrawals}
                onChange={(event) => setPreviousWithdrawals(event.target.value)}
              >
                {Array.from(
                  { length: purposePolicy.frequencyLimit + 1 },
                  (_, index) => (
                    <option key={index} value={index}>
                      {index}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          <div className={styles.actions}>
            <Button variant="quiet" onClick={() => setStep(1)}>
              {t.common.back}
            </Button>
            <Button type="submit">
              {locale === "hi" ? "राशि पर आगे बढ़ें" : "Continue to amount"}
            </Button>
          </div>
        </form>
      ) : null}

      {step === 3 ? (
        <form className={styles.step} onSubmit={calculateResult}>
          <div className={styles.stepHeading}>
            <p>{locale === "hi" ? "प्रश्न 3 / 3" : "Question 3 of 3"}</p>
            <h3>
              {locale === "hi"
                ? "इस डेमो में कितनी राशि की आवश्यकता है?"
                : "How much is needed in this demo?"}
            </h3>
            <span>
              {locale === "hi"
                ? "यदि लागू नियम सीमा कम है, तो कैलकुलेटर कम राशि दर्शा सकता है।"
                : "The calculator may return less if the mock policy cap is lower."}
            </span>
          </div>

          <div className={styles.amountContext}>
            <div>
              <span>
                {locale === "hi"
                  ? "कर्मचारी + नियोक्ता हिस्सा"
                  : "Employee + employer shares considered"}
              </span>
              <strong>{currencyFormatter.format(contributionBalance)}</strong>
            </div>
            <div>
              <span>
                {locale === "hi"
                  ? "पेंशन हिस्सा (सुरक्षित)"
                  : "Pension share excluded"}
              </span>
              <strong>
                {currencyFormatter.format(
                  demoCase.workspace.balance.pensionShareRupees,
                )}
              </strong>
            </div>
          </div>

          <TextField
            id="synthetic-amount-needed"
            label={locale === "hi" ? "आवश्यक राशि" : "Amount needed"}
            hint={
              locale === "hi"
                ? "काल्पनिक रुपया राशि दर्ज करें। कोई वास्तविक धन ट्रांसफर नहीं होता।"
                : "Enter a fictional rupee amount. No money is moved."
            }
            error={amountError}
            type="number"
            inputMode="numeric"
            min="1"
            max="10000000"
            required
            value={amountNeeded}
            onChange={(event) => setAmountNeeded(event.target.value)}
          />

          <div className={styles.actions}>
            <Button variant="quiet" onClick={() => setStep(2)}>
              {t.common.back}
            </Button>
            <Button type="submit">
              {locale === "hi"
                ? "काल्पनिक पात्रता गणना करें"
                : "Calculate mock result"}
            </Button>
          </div>
        </form>
      ) : null}

      {step === 4 ? (
        <EligibilityResultView
          result={result}
          onChangeAnswers={() => setStep(1)}
          onBack={onBack}
          onStartMockClaim={onStartMockClaim}
        />
      ) : null}
    </section>
  );
}

type EligibilityResultViewProps = Readonly<{
  result: EligibilityResult;
  onChangeAnswers: () => void;
  onBack: () => void;
  onStartMockClaim: () => void;
}>;

function EligibilityResultView({
  onBack,
  onChangeAnswers,
  onStartMockClaim,
  result,
}: EligibilityResultViewProps) {
  const { locale } = useLocale();

  return (
    <section
      className={styles.result}
      aria-labelledby="eligibility-result-title"
    >
      <header className={styles.resultHeader}>
        <StatusBadge tone={result.eligible ? "success" : "critical"}>
          {result.eligible
            ? locale === "hi"
              ? "इस डेमो में पात्र"
              : "Eligible in this demo"
            : locale === "hi"
              ? "इस डेमो में अपात्र"
              : "Not eligible in this demo"}
        </StatusBadge>
        <p>
          {locale === "hi"
            ? "काल्पनिक पात्रता परिणाम"
            : "Mock eligibility result"}
        </p>
        <h3 id="eligibility-result-title">
          {result.eligible
            ? locale === "hi"
              ? `इस डेमो में अधिकतम ${currencyFormatter.format(result.amounts.eligibleAmountRupees)} तक`
              : `Up to ${currencyFormatter.format(result.amounts.eligibleAmountRupees)} in this demo`
            : locale === "hi"
              ? "इन उत्तरों के आधार पर ₹0"
              : "₹0 under these answers"}
        </h3>
        <span>{result.limitingRule}</span>
      </header>

      <div className={styles.resultGrid}>
        <section aria-labelledby="breakdown-title">
          <h4 id="breakdown-title">
            {locale === "hi" ? "राशि विवरण" : "Amount breakdown"}
          </h4>
          <dl className={styles.breakdown}>
            <div>
              <dt>{locale === "hi" ? "दर्ज की गई राशि" : "Amount entered"}</dt>
              <dd>
                {currencyFormatter.format(result.amounts.amountNeededRupees)}
              </dd>
            </div>
            <div>
              <dt>
                {locale === "hi"
                  ? "कर्मचारी + नियोक्ता हिस्सा"
                  : "Employee + employer shares"}
              </dt>
              <dd>
                {currencyFormatter.format(
                  result.amounts.contributionBalanceRupees,
                )}
              </dd>
            </div>
            <div>
              <dt>
                {locale === "hi"
                  ? "पेंशन शेयर (सुरक्षित)"
                  : "Protected pension share"}
              </dt>
              <dd>
                {currencyFormatter.format(result.amounts.pensionExcludedRupees)}
              </dd>
            </div>
            <div>
              <dt>
                {locale === "hi" ? "अंतिम पात्र राशि" : "Final eligible amount"}
              </dt>
              <dd className={styles.eligibleAmount}>
                {currencyFormatter.format(result.amounts.eligibleAmountRupees)}
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="checks-title">
          <h4 id="checks-title">
            {locale === "hi" ? "पॉलिसी जांच" : "Policy checks"}
          </h4>
          <ul className={styles.checkList}>
            {result.checks.map((check) => (
              <li key={check.id} data-status={check.passed ? "pass" : "fail"}>
                <div>
                  <strong>{check.label}</strong>
                  <p>{check.explanation}</p>
                </div>
                <StatusBadge tone={check.passed ? "success" : "critical"}>
                  {check.passed
                    ? locale === "hi"
                      ? "सफल"
                      : "Pass"
                    : locale === "hi"
                      ? "विफल"
                      : "Fail"}
                </StatusBadge>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className={styles.sourceBox}>
        <div>
          <span>
            {locale === "hi" ? "नियम संदर्भ" : "Rule basis on record"}
          </span>
          <p>{result.limitingRule}</p>
        </div>
        <ExternalCitationLink
          href={ELIGIBILITY_POLICY_SOURCE_URL}
          className={styles.sourceLink}
        >
          {locale === "hi"
            ? "ईपीएफओ स्रोत दिशानिर्देश देखें"
            : "Review EPFO source guidelines"}
        </ExternalCitationLink>
      </div>

      <div className={styles.actions}>
        <Button variant="quiet" onClick={onChangeAnswers}>
          {locale === "hi" ? "उत्तर बदलें" : "Change answers"}
        </Button>
        <Button variant="secondary" onClick={onBack}>
          {locale === "hi" ? "वर्कस्पेस पर लौटें" : "Back to workspace"}
        </Button>
        {result.eligible ? (
          <Button onClick={onStartMockClaim}>
            {locale === "hi"
              ? "मॉक दावा फॉर्म शुरू करें →"
              : "Start simplified mock claim →"}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
