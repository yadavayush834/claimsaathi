"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
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

import styles from "./withdrawal-planner.module.css";

type WithdrawalPlannerProps = Readonly<{
  demoCase: DemoCase;
  onBack: () => void;
}>;

type PlannerStep = 1 | 2 | 3 | 4;

const plannerSteps = ["Goal", "Details", "Amount", "Result"] as const;

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
}: WithdrawalPlannerProps) {
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

  function continueFromGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStep(2);
  }

  function continueFromDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const months = parseWholeNumber(serviceMonths);

    if (months < 0 || months > 600 || !Number.isFinite(months)) {
      setServiceError("Enter synthetic service between 0 and 600 months.");
      return;
    }

    setServiceError(undefined);
    setStep(3);
  }

  function calculateResult(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = parseWholeNumber(amountNeeded);

    if (amount <= 0 || amount > 10000000 || !Number.isFinite(amount)) {
      setAmountError("Enter a synthetic amount from ₹1 to ₹1,00,00,000.");
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
          <p>Fictional planning tool · no submission</p>
          <h2 id="planner-title">Plan a mock PF withdrawal</h2>
          <span>{demoCase.persona.displayName}&apos;s synthetic case</span>
        </div>
        <Button variant="quiet" onClick={onBack}>
          Back to workspace
        </Button>
      </header>

      <nav className={styles.progress} aria-label="Planning progress">
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

      <Callout title="Use fictional answers only">
        This tool estimates a mock amount from a published policy snapshot. It
        does not check a real EPFO account or confirm entitlement.
      </Callout>

      {step === 1 ? (
        <form className={styles.step} onSubmit={continueFromGoal}>
          <div className={styles.stepHeading}>
            <p>Question 1 of 3</p>
            <h3>What is the withdrawal for?</h3>
            <span>Choose one fictional need for this calculation.</span>
          </div>

          <fieldset className={styles.purposeFieldset}>
            <legend>Withdrawal purpose</legend>
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
            <Button type="submit">Continue to details</Button>
          </div>
        </form>
      ) : null}

      {step === 2 ? (
        <form className={styles.step} onSubmit={continueFromDetails}>
          <div className={styles.stepHeading}>
            <p>Question 2 of 3</p>
            <h3>Does this fictional case meet the basic checks?</h3>
            <span>
              The demo checks total service and prior{" "}
              {purposePolicy.label.toLowerCase()} withdrawals.
            </span>
          </div>

          <div className={styles.fieldGrid}>
            <TextField
              id="synthetic-service-months"
              label="Total service in months"
              hint="Synthetic value only. The demo minimum is 12 months."
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
                Previous {purposePolicy.label.toLowerCase()} withdrawals
              </label>
              <span id="previous-withdrawals-hint">
                Demo limit: {purposePolicy.frequencyLimit}{" "}
                {purposePolicy.frequencyWindow}.
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
              Back
            </Button>
            <Button type="submit">Continue to amount</Button>
          </div>
        </form>
      ) : null}

      {step === 3 ? (
        <form className={styles.step} onSubmit={calculateResult}>
          <div className={styles.stepHeading}>
            <p>Question 3 of 3</p>
            <h3>How much is needed in this demo?</h3>
            <span>
              The calculator may return less if the mock policy cap is lower.
            </span>
          </div>

          <div className={styles.amountContext}>
            <div>
              <span>Employee + employer shares considered</span>
              <strong>{currencyFormatter.format(contributionBalance)}</strong>
            </div>
            <div>
              <span>Pension share excluded</span>
              <strong>
                {currencyFormatter.format(
                  demoCase.workspace.balance.pensionShareRupees,
                )}
              </strong>
            </div>
          </div>

          <TextField
            id="synthetic-amount-needed"
            label="Amount needed"
            hint="Enter a fictional rupee amount. No money is moved."
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
              Back
            </Button>
            <Button type="submit">Calculate mock result</Button>
          </div>
        </form>
      ) : null}

      {step === 4 ? (
        <EligibilityResultView
          result={result}
          onChangeAnswers={() => setStep(1)}
          onBack={onBack}
        />
      ) : null}
    </section>
  );
}

type EligibilityResultViewProps = Readonly<{
  result: EligibilityResult;
  onChangeAnswers: () => void;
  onBack: () => void;
}>;

function EligibilityResultView({
  onBack,
  onChangeAnswers,
  result,
}: EligibilityResultViewProps) {
  return (
    <section
      className={styles.result}
      aria-labelledby="eligibility-result-title"
    >
      <header className={styles.resultHeader}>
        <StatusBadge tone={result.eligible ? "success" : "critical"}>
          {result.eligible
            ? "Eligible in this demo"
            : "Not eligible in this demo"}
        </StatusBadge>
        <p>Mock eligibility result</p>
        <h3 id="eligibility-result-title">
          {result.eligible
            ? `Up to ${currencyFormatter.format(result.amounts.eligibleAmountRupees)} in this demo`
            : "₹0 under these answers"}
        </h3>
        <span>{result.limitingRule}</span>
      </header>

      <div className={styles.resultGrid}>
        <section aria-labelledby="breakdown-title">
          <h4 id="breakdown-title">Amount breakdown</h4>
          <dl className={styles.breakdown}>
            <div>
              <dt>Amount entered</dt>
              <dd>
                {currencyFormatter.format(result.amounts.amountNeededRupees)}
              </dd>
            </div>
            <div>
              <dt>Employee + employer shares</dt>
              <dd>
                {currencyFormatter.format(
                  result.amounts.contributionBalanceRupees,
                )}
              </dd>
            </div>
            <div>
              <dt>Protected 25%</dt>
              <dd>
                −
                {currencyFormatter.format(
                  result.amounts.protectedBalanceRupees,
                )}
              </dd>
            </div>
            <div>
              <dt>Mock policy maximum</dt>
              <dd>
                {currencyFormatter.format(result.amounts.policyMaximumRupees)}
              </dd>
            </div>
            <div className={styles.breakdownTotal}>
              <dt>Mock eligible amount</dt>
              <dd>
                {currencyFormatter.format(result.amounts.eligibleAmountRupees)}
              </dd>
            </div>
            <div>
              <dt>Contribution balance after</dt>
              <dd>
                {currencyFormatter.format(
                  result.amounts.contributionBalanceAfterRupees,
                )}
              </dd>
            </div>
          </dl>
          <p className={styles.excludedAmount}>
            Pension share excluded from this calculation:{" "}
            {currencyFormatter.format(result.amounts.pensionExcludedRupees)}.
          </p>
        </section>

        <section aria-labelledby="checks-title">
          <h4 id="checks-title">Why this result?</h4>
          <ul className={styles.checks}>
            {result.checks.map((check) => (
              <li key={check.id}>
                <StatusBadge tone={check.passed ? "success" : "critical"}>
                  {check.passed ? "Passed" : "Not met"}
                </StatusBadge>
                <div>
                  <strong>{check.label}</strong>
                  <p>{check.explanation}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside
        className={styles.policyNote}
        aria-label="Policy source and limitation"
      >
        <strong>Policy snapshot, not an entitlement decision</strong>
        <p>
          This demo models the EPFO reform framework announced on 13 October
          2025: 12 months&apos; service, purpose frequency limits, and a 25%
          protected balance. Actual notified rules and portal decisions may
          differ.
        </p>
        <a
          href={ELIGIBILITY_POLICY_SOURCE_URL}
          target="_blank"
          rel="noreferrer"
        >
          Read the official EPFO press brief ↗
        </a>
      </aside>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onChangeAnswers}>
          Change answers
        </Button>
        <Button onClick={onBack}>Return to workspace</Button>
      </div>
    </section>
  );
}
