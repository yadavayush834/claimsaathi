"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";
import { TextField } from "@/components/ui/text-field";
import { createMockClaimDraftStore } from "@/lib/demo/mock-claim-draft-store";
import {
  DEFAULT_SIMULATED_OTP,
  submitMockClaim,
} from "@/lib/demo/mock-claim-submission-service";
import type {
  DemoCase,
  MockClaimDraft,
  MockClaimFormStep,
  MockClaimSubmissionReceipt,
  MockClaimSubmissionRequest,
  MockClaimSubmissionResult,
} from "@/lib/demo/model";

import styles from "./mock-claim-form.module.css";

type MockClaimFormProps = Readonly<{
  demoCase: DemoCase;
  onBack: () => void;
  onSubmitted?: (receipt: MockClaimSubmissionReceipt) => void;
}>;

type FormErrors = Readonly<{
  treatmentNeed?: string;
  fictionalCity?: string;
  bankConfirmed?: string;
  declarationConfirmed?: string;
  consentConfirmed?: string;
  simulatedOtp?: string;
}>;

const formSteps = [
  "Need",
  "Payment",
  "Declaration",
  "Review & Submit",
] as const;

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function createNewDraft(personaId: DemoCase["persona"]["id"]): MockClaimDraft {
  return {
    version: 1,
    personaId,
    step: 1,
    treatmentNeed: "",
    fictionalCity: "",
    notificationRoute: "browser",
    bankConfirmed: false,
    declarationConfirmed: false,
    consentConfirmed: false,
    simulatedOtp: DEFAULT_SIMULATED_OTP,
  };
}

function loadInitialDraft(personaId: DemoCase["persona"]["id"]) {
  if (typeof window === "undefined") {
    return { draft: createNewDraft(personaId), wasRestored: false };
  }

  const restored = createMockClaimDraftStore(window.localStorage).load(
    personaId,
  );

  return restored
    ? { draft: restored, wasRestored: true }
    : { draft: createNewDraft(personaId), wasRestored: false };
}

function nextStep(step: MockClaimFormStep): MockClaimFormStep {
  if (step === 1) return 2;
  if (step === 2) return 3;
  return 4;
}

function previousStep(step: MockClaimFormStep): MockClaimFormStep {
  if (step === 4) return 3;
  if (step === 3) return 2;
  return 1;
}

export function MockClaimForm({
  demoCase,
  onBack,
  onSubmitted,
}: MockClaimFormProps) {
  const [initialDraft] = useState(() => loadInitialDraft(demoCase.persona.id));
  const [draft, setDraft] = useState<MockClaimDraft>(initialDraft.draft);
  const [wasRestored] = useState(initialDraft.wasRestored);
  const [saved, setSaved] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<MockClaimSubmissionReceipt | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

  function updateDraft(patch: Partial<MockClaimDraft>) {
    const nextDraft = { ...draft, ...patch };
    setDraft(nextDraft);
    setSaved(createMockClaimDraftStore(window.localStorage).save(nextDraft));
  }

  function continueFromNeed(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FormErrors = {
      treatmentNeed: draft.treatmentNeed.trim()
        ? undefined
        : "Describe the fictional treatment or need before continuing.",
      fictionalCity: draft.fictionalCity.trim()
        ? undefined
        : "Enter a fictional city for this demo.",
    };

    setErrors(nextErrors);
    if (nextErrors.treatmentNeed || nextErrors.fictionalCity) {
      return;
    }

    updateDraft({ step: nextStep(draft.step) });
  }

  function continueFromPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FormErrors = {
      bankConfirmed: draft.bankConfirmed
        ? undefined
        : "Confirm the fictional bank record before continuing.",
    };

    setErrors(nextErrors);
    if (nextErrors.bankConfirmed) {
      return;
    }

    updateDraft({ step: nextStep(draft.step) });
  }

  function continueFromDeclaration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FormErrors = {
      declarationConfirmed: draft.declarationConfirmed
        ? undefined
        : "Confirm the fictional declaration before proceeding.",
    };

    setErrors(nextErrors);
    if (nextErrors.declarationConfirmed) {
      return;
    }

    updateDraft({ step: nextStep(draft.step) });
  }

  async function submitClaim(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {
      consentConfirmed: draft.consentConfirmed
        ? undefined
        : "Consent is required to simulate this mock claim submission.",
      simulatedOtp:
        draft.simulatedOtp?.trim() === DEFAULT_SIMULATED_OTP
          ? undefined
          : `Enter the 6-digit demo code: ${DEFAULT_SIMULATED_OTP}`,
    };

    setErrors(nextErrors);
    if (nextErrors.consentConfirmed || nextErrors.simulatedOtp) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    const payload: MockClaimSubmissionRequest = {
      personaId: demoCase.persona.id,
      treatmentNeed: draft.treatmentNeed,
      fictionalCity: draft.fictionalCity,
      notificationRoute: draft.notificationRoute,
      bankConfirmed: draft.bankConfirmed,
      declarationConfirmed: draft.declarationConfirmed,
      consentConfirmed: Boolean(draft.consentConfirmed),
      simulatedOtp: draft.simulatedOtp ?? DEFAULT_SIMULATED_OTP,
      requestedAmountRupees: demoCase.claim.requestedAmountRupees,
    };

    try {
      let result: MockClaimSubmissionResult;
      try {
        const response = await fetch("/api/demo/submit-claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        result = (await response.json()) as MockClaimSubmissionResult;
      } catch {
        result = submitMockClaim(payload);
      }

      if (result.ok) {
        setReceipt(result.receipt);
        createMockClaimDraftStore(window.localStorage).clear(
          demoCase.persona.id,
        );
        onSubmitted?.(result.receipt);
      } else {
        setSubmissionError(result.error);
        if (result.field) {
          setErrors((prev) => ({ ...prev, [result.field!]: result.error }));
        }
      }
    } catch (err) {
      setSubmissionError(
        err instanceof Error ? err.message : "Mock submission failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function goBack() {
    updateDraft({ step: previousStep(draft.step) });
    setErrors({});
    setSubmissionError(null);
  }

  function copyReceiptSummary() {
    if (!receipt) return;
    const summary = [
      `ClaimSaathi Mock Claim Acknowledgement`,
      `Acknowledgement No: ${receipt.acknowledgementNumber}`,
      `Claim Ref: ${receipt.claimReference}`,
      `Citizen: ${demoCase.persona.displayName}`,
      `Amount: ${currencyFormatter.format(receipt.requestedAmountRupees)}`,
      `Submitted At: ${receipt.submittedAt}`,
      `Status: Submitted in demo (Synthetic)`,
    ].join("\n");

    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  if (receipt) {
    return (
      <section
        className={styles.receipt}
        aria-labelledby="ack-title"
        aria-live="polite"
      >
        <header className={styles.receiptHeader}>
          <div className={styles.receiptCheck} aria-hidden="true">
            ✓
          </div>
          <div>
            <StatusBadge tone="success">Submitted in demo</StatusBadge>
            <p className={styles.receiptEyebrow}>
              Synthetic Claim Acknowledgement
            </p>
            <h2 id="ack-title">Your mock claim has been received</h2>
            <span>
              Generated deterministically by ClaimSaathi&apos;s local service.
              No real EPFO record was created.
            </span>
          </div>
        </header>

        <section
          className={styles.receiptDetails}
          aria-labelledby="receipt-card-title"
        >
          <div className={styles.receiptCodeBanner}>
            <div>
              <span>Fictional Acknowledgement ID</span>
              <strong id="receipt-card-title">
                {receipt.acknowledgementNumber}
              </strong>
            </div>
            <div>
              <span>Claim Reference</span>
              <strong>{receipt.claimReference}</strong>
            </div>
          </div>

          <dl className={styles.receiptGrid}>
            <div>
              <dt>Citizen</dt>
              <dd>{demoCase.persona.displayName}</dd>
            </div>
            <div>
              <dt>Requested amount</dt>
              <dd className={styles.receiptAmount}>
                {currencyFormatter.format(receipt.requestedAmountRupees)}
              </dd>
            </div>
            <div>
              <dt>Fictional purpose</dt>
              <dd>Medical treatment · {draft.treatmentNeed}</dd>
            </div>
            <div>
              <dt>Fictional city</dt>
              <dd>{draft.fictionalCity}</dd>
            </div>
            <div>
              <dt>Payout route</dt>
              <dd>Asha Verma · •••• 8421</dd>
            </div>
            <div>
              <dt>Simulated timeline</dt>
              <dd>{receipt.estimatedWorkingDays} fictional working days</dd>
            </div>
          </dl>
        </section>

        <aside
          className={styles.nextStepBox}
          aria-label="Next steps in the demo"
        >
          <strong>What happens next in this prototype?</strong>
          <p>
            In the upcoming build phases, you will be able to track this mock
            claim through its simulated settlement and resolution timeline.
          </p>
        </aside>

        <div className={styles.receiptActions}>
          <Button variant="secondary" onClick={copyReceiptSummary}>
            {copied ? "✓ Copied receipt" : "Copy acknowledgement summary"}
          </Button>
          <Button onClick={onBack}>Return to workspace</Button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.form} aria-labelledby="claim-form-title">
      <header className={styles.header}>
        <div>
          <p>Fictional claim packet · saved in this browser</p>
          <h2 id="claim-form-title">
            {draft.step === 4
              ? "Review and submit mock claim"
              : "Add the details for this mock claim"}
          </h2>
          <span>{demoCase.persona.displayName}&apos;s synthetic case</span>
        </div>
        <Button variant="quiet" onClick={onBack}>
          Back to workspace
        </Button>
      </header>

      <Callout title="Use fictional details only">
        This is a local prototype form. Do not enter real bank details, health
        information, Aadhaar, PAN, UAN, passwords, or OTPs.
      </Callout>

      <div className={styles.draftBar}>
        <div>
          <span className={styles.draftDot} aria-hidden="true" />
          <strong>
            {saved ? "Draft saved locally" : "Saving fictional draft…"}
          </strong>
          <small>
            {wasRestored
              ? "Previous progress was restored in this browser."
              : "Progress is saved after each change."}
          </small>
        </div>
        <StatusBadge tone="info">
          {draft.step === 4 ? "Ready to submit" : "No submission"}
        </StatusBadge>
      </div>

      <nav className={styles.progress} aria-label="Mock claim form progress">
        <ol>
          {formSteps.map((label, index) => {
            const step = (index + 1) as MockClaimFormStep;
            const state =
              step < draft.step
                ? "complete"
                : step === draft.step
                  ? "current"
                  : "upcoming";

            return (
              <li key={label} data-state={state}>
                <span aria-hidden="true">{step < draft.step ? "✓" : step}</span>
                <strong aria-current={step === draft.step ? "step" : undefined}>
                  {label}
                </strong>
              </li>
            );
          })}
        </ol>
      </nav>

      {draft.step === 1 ? (
        <form className={styles.packet} onSubmit={continueFromNeed}>
          <div className={styles.packetHeading}>
            <p>Part 1 of 4</p>
            <h3>What is this fictional advance for?</h3>
            <span>
              Use a short fictional description. This does not create a real
              claim.
            </span>
          </div>

          <div className={styles.fixedDetail}>
            <span>Mock withdrawal purpose</span>
            <strong>Medical treatment</strong>
            <small>Carried from Asha&apos;s fictional planning case.</small>
          </div>

          <div className={styles.fieldGrid}>
            <TextField
              id="mock-treatment-need"
              label="Fictional treatment or need"
              hint="Example: Planned outpatient treatment. Do not describe a real condition."
              error={errors.treatmentNeed}
              maxLength={120}
              required
              value={draft.treatmentNeed}
              onChange={(event) =>
                updateDraft({ treatmentNeed: event.target.value })
              }
            />
            <TextField
              id="mock-claim-city"
              label="Fictional city"
              hint="Example: Faridabad. This is only used in the demo draft."
              error={errors.fictionalCity}
              maxLength={60}
              required
              value={draft.fictionalCity}
              onChange={(event) =>
                updateDraft({ fictionalCity: event.target.value })
              }
            />
          </div>

          <div className={styles.actions}>
            <Button type="submit">Continue to payment details</Button>
          </div>
        </form>
      ) : null}

      {draft.step === 2 ? (
        <form className={styles.packet} onSubmit={continueFromPayment}>
          <div className={styles.packetHeading}>
            <p>Part 2 of 4</p>
            <h3>Confirm how this mock claim would be paid</h3>
            <span>Only a fictional, masked bank record is shown here.</span>
          </div>

          <section
            className={styles.paymentSlip}
            aria-labelledby="bank-record-title"
          >
            <div>
              <span>Fictional payment record</span>
              <strong id="bank-record-title">Asha Verma · •••• 8421</strong>
              <small>Mock bank transfer route · no bank is contacted</small>
            </div>
            <StatusBadge tone="success">Ready in demo</StatusBadge>
          </section>

          <fieldset className={styles.routeFieldset}>
            <legend>Where should this mock update appear?</legend>
            <span>
              Choose a fictional notification route. No real message is sent.
            </span>
            <div>
              {[
                [
                  "browser",
                  "Inside this browser",
                  "Show updates only in this prototype.",
                ],
                [
                  "mock_sms",
                  "Mock SMS",
                  "A fictional SMS preview will be used later.",
                ],
                [
                  "mock_email",
                  "Mock email",
                  "A fictional email preview will be used later.",
                ],
              ].map(([value, label, hint]) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="notification-route"
                    value={value}
                    checked={draft.notificationRoute === value}
                    onChange={() =>
                      updateDraft({
                        notificationRoute:
                          value as MockClaimDraft["notificationRoute"],
                      })
                    }
                  />
                  <span>
                    <strong>{label}</strong>
                    <small>{hint}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className={styles.confirmation}>
            <input
              type="checkbox"
              checked={draft.bankConfirmed}
              onChange={(event) =>
                updateDraft({ bankConfirmed: event.target.checked })
              }
            />
            <span>I checked this fictional bank record for the demo.</span>
          </label>
          {errors.bankConfirmed ? (
            <p className={styles.error}>{errors.bankConfirmed}</p>
          ) : null}

          <div className={styles.actions}>
            <Button variant="quiet" onClick={goBack}>
              Back
            </Button>
            <Button type="submit">Continue to declaration</Button>
          </div>
        </form>
      ) : null}

      {draft.step === 3 ? (
        <form className={styles.packet} onSubmit={continueFromDeclaration}>
          <div className={styles.packetHeading}>
            <p>Part 3 of 4</p>
            <h3>Confirm the fictional declaration</h3>
            <span>
              Every detail remains sandbox-only. Review the summary on the next
              step.
            </span>
          </div>

          <section
            className={styles.declaration}
            aria-labelledby="declaration-title"
          >
            <div>
              <p id="declaration-title">Fictional declaration</p>
              <strong>
                I confirm that every detail in this draft is synthetic.
              </strong>
              <span>
                No real person, bank account, health detail, OTP, or government
                account is involved.
              </span>
            </div>
            <label className={styles.confirmation}>
              <input
                type="checkbox"
                checked={draft.declarationConfirmed}
                onChange={(event) =>
                  updateDraft({ declarationConfirmed: event.target.checked })
                }
              />
              <span>I confirm this fictional declaration.</span>
            </label>
          </section>
          {errors.declarationConfirmed ? (
            <p className={styles.error}>{errors.declarationConfirmed}</p>
          ) : null}

          <div className={styles.actions}>
            <Button variant="quiet" onClick={goBack}>
              Back
            </Button>
            <Button type="submit">Continue to review & submit</Button>
          </div>
        </form>
      ) : null}

      {draft.step === 4 ? (
        <form className={styles.packet} onSubmit={submitClaim}>
          <div className={styles.packetHeading}>
            <p>Part 4 of 4</p>
            <h3>Review summary & simulated OTP</h3>
            <span>
              Verify the packet details, authorize the demo submission, and
              verify with the simulated code.
            </span>
          </div>

          <section
            className={styles.reviewSummary}
            aria-labelledby="review-summary-title"
          >
            <div className={styles.reviewHeading}>
              <h4 id="review-summary-title">Claim packet summary</h4>
              <Button
                variant="quiet"
                onClick={() => updateDraft({ step: 1 })}
                type="button"
              >
                Edit details
              </Button>
            </div>
            <dl className={styles.reviewGrid}>
              <div>
                <dt>Citizen</dt>
                <dd>{demoCase.persona.displayName}</dd>
              </div>
              <div>
                <dt>Requested amount</dt>
                <dd className={styles.reviewAmount}>
                  {currencyFormatter.format(
                    demoCase.claim.requestedAmountRupees,
                  )}
                </dd>
              </div>
              <div>
                <dt>Need & treatment</dt>
                <dd>Medical treatment · {draft.treatmentNeed}</dd>
              </div>
              <div>
                <dt>Fictional city</dt>
                <dd>{draft.fictionalCity}</dd>
              </div>
              <div>
                <dt>Payout record</dt>
                <dd>Asha Verma · •••• 8421</dd>
              </div>
              <div>
                <dt>Notification route</dt>
                <dd>
                  {draft.notificationRoute === "browser"
                    ? "Inside this browser"
                    : draft.notificationRoute === "mock_sms"
                      ? "Mock SMS"
                      : "Mock email"}
                </dd>
              </div>
            </dl>
          </section>

          <section
            className={styles.consentBox}
            aria-labelledby="consent-title"
          >
            <h4 id="consent-title">
              Simulated consent & sandbox authorization
            </h4>
            <label className={styles.consentLabel}>
              <input
                type="checkbox"
                checked={Boolean(draft.consentConfirmed)}
                onChange={(event) =>
                  updateDraft({ consentConfirmed: event.target.checked })
                }
              />
              <span>
                I authorize ClaimSaathi to simulate this claim submission using
                synthetic credentials in this browser sandbox.
              </span>
            </label>
            {errors.consentConfirmed ? (
              <p className={styles.error}>{errors.consentConfirmed}</p>
            ) : null}
          </section>

          <section className={styles.otpSection} aria-labelledby="otp-title">
            <div className={styles.otpHeader}>
              <div>
                <h4 id="otp-title">Simulated Aadhaar OTP verification</h4>
                <p>
                  A simulated OTP was dispatched to fictional mobile +91 •••••
                  ••842.
                </p>
              </div>
              <span className={styles.demoCodeBadge}>
                Demo OTP: <strong>{DEFAULT_SIMULATED_OTP}</strong>
              </span>
            </div>

            <div className={styles.otpInputContainer}>
              <TextField
                id="simulated-otp-input"
                label="6-digit simulated OTP"
                hint={`Enter ${DEFAULT_SIMULATED_OTP} to complete this simulated verification.`}
                error={errors.simulatedOtp}
                maxLength={6}
                required
                value={draft.simulatedOtp ?? DEFAULT_SIMULATED_OTP}
                onChange={(event) =>
                  updateDraft({ simulatedOtp: event.target.value })
                }
              />
            </div>
          </section>

          {submissionError ? (
            <p className={styles.error}>{submissionError}</p>
          ) : null}

          <div className={styles.actions}>
            <Button variant="quiet" onClick={goBack} disabled={isSubmitting}>
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting mock claim…"
                : "Verify & Submit Mock Claim"}
            </Button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
