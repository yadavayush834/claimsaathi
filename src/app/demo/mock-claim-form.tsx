"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";
import { TextField } from "@/components/ui/text-field";
import { createMockClaimDraftStore } from "@/lib/demo/mock-claim-draft-store";
import type {
  DemoCase,
  MockClaimDraft,
  MockClaimFormStep,
} from "@/lib/demo/model";

import styles from "./mock-claim-form.module.css";

type MockClaimFormProps = Readonly<{
  demoCase: DemoCase;
  onBack: () => void;
}>;

type FormErrors = Readonly<{
  treatmentNeed?: string;
  fictionalCity?: string;
  bankConfirmed?: string;
  declarationConfirmed?: string;
}>;

const formSteps = ["Need", "Payment", "Declaration"] as const;

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
  return step === 1 ? 2 : 3;
}

function previousStep(step: MockClaimFormStep): MockClaimFormStep {
  return step === 3 ? 2 : 1;
}

export function MockClaimForm({ demoCase, onBack }: MockClaimFormProps) {
  const [initialDraft] = useState(() => loadInitialDraft(demoCase.persona.id));
  const [draft, setDraft] = useState<MockClaimDraft>(initialDraft.draft);
  const [wasRestored] = useState(initialDraft.wasRestored);
  const [saved, setSaved] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isReadyForReview, setIsReadyForReview] = useState(false);

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

  function saveForReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FormErrors = {
      declarationConfirmed: draft.declarationConfirmed
        ? undefined
        : "Confirm the fictional declaration before saving the draft.",
    };

    setErrors(nextErrors);
    if (nextErrors.declarationConfirmed) {
      return;
    }

    const persisted = createMockClaimDraftStore(window.localStorage).save(
      draft,
    );
    setSaved(persisted);
    setIsReadyForReview(true);
  }

  function goBack() {
    updateDraft({ step: previousStep(draft.step) });
    setErrors({});
  }

  if (isReadyForReview) {
    return (
      <section className={styles.complete} aria-live="polite">
        <span aria-hidden="true">✓</span>
        <div>
          <p>Mock claim details saved</p>
          <h2>Ready for the review step.</h2>
          <span>
            This fictional draft is saved in this browser. Review, consent, OTP,
            and submission are intentionally added in the next phase.
          </span>
        </div>
        <Button variant="secondary" onClick={onBack}>
          Return to workspace
        </Button>
      </section>
    );
  }

  return (
    <section className={styles.form} aria-labelledby="claim-form-title">
      <header className={styles.header}>
        <div>
          <p>Fictional claim packet · saved in this browser</p>
          <h2 id="claim-form-title">Add the details for this mock claim</h2>
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
        <StatusBadge tone="info">No submission</StatusBadge>
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
            <p>Part 1 of 3</p>
            <h3>What is this fictional advance for?</h3>
            <span>
              Use a short fictional description. This does not create a claim.
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
            <p>Part 2 of 3</p>
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
        <form className={styles.packet} onSubmit={saveForReview}>
          <div className={styles.packetHeading}>
            <p>Part 3 of 3</p>
            <h3>Save this fictional draft for review</h3>
            <span>
              The next phase adds the actual mock review and submission step.
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
            <Button type="submit">Save mock claim details</Button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
