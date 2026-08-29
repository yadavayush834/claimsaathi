import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { demoDataService } from "@/lib/demo/demo-service";
import { DEFAULT_SIMULATED_OTP } from "@/lib/demo/mock-claim-submission-service";

import { MockClaimForm } from "./mock-claim-form";

afterEach(cleanup);

function renderForm() {
  const demoCase = demoDataService.loadCase("asha-planning");
  const onBack = vi.fn();
  const onSubmitted = vi.fn();

  expect(demoCase).not.toBeNull();
  render(
    <MockClaimForm
      demoCase={demoCase!}
      onBack={onBack}
      onSubmitted={onSubmitted}
    />,
  );

  return { onBack, onSubmitted };
}

function completeNeed() {
  fireEvent.change(screen.getByLabelText("Fictional treatment or need"), {
    target: { value: "Fictional outpatient treatment" },
  });
  fireEvent.change(screen.getByLabelText("Fictional city"), {
    target: { value: "Faridabad" },
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Continue to payment details" }),
  );
}

function completePayment() {
  fireEvent.click(
    screen.getByLabelText("I checked this fictional bank record for the demo."),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Continue to declaration" }),
  );
}

function completeDeclaration() {
  fireEvent.click(
    screen.getByLabelText("I confirm this fictional declaration."),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Continue to review & submit" }),
  );
}

describe("MockClaimForm", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows actionable errors instead of allowing an empty mock claim in part 1", () => {
    renderForm();

    fireEvent.submit(
      screen
        .getByRole("button", { name: "Continue to payment details" })
        .closest("form")!,
    );

    expect(
      screen.getByText(
        "Describe the fictional treatment or need before continuing.",
      ),
    ).toBeVisible();
    expect(
      screen.getByText("Enter a fictional city for this demo."),
    ).toBeVisible();
  });

  it("does not retain a sensitive identifier in the fictional draft", () => {
    renderForm();

    fireEvent.change(screen.getByLabelText("Fictional treatment or need"), {
      target: { value: "UAN 109988776655" },
    });

    expect(screen.getByText("Privacy & Safety Notice")).toBeVisible();
    expect(screen.getByLabelText("Fictional treatment or need")).toHaveValue(
      "",
    );
    expect(
      window.localStorage.getItem("claimsaathi.mock-claim-draft.v1"),
    ).toBeNull();
  });

  it("navigates through review, verifies simulated OTP, and generates synthetic receipt", async () => {
    const { onBack, onSubmitted } = renderForm();

    completeNeed();
    completePayment();
    completeDeclaration();

    expect(
      screen.getByRole("heading", {
        name: "Review summary & simulated OTP",
      }),
    ).toBeVisible();

    // Verify packet review summary data
    expect(screen.getByText("Asha Verma")).toBeVisible();
    expect(screen.getByText("Faridabad")).toBeVisible();
    expect(
      screen.getByText("Medical treatment · Fictional outpatient treatment"),
    ).toBeVisible();

    // Attempt submission without consent
    fireEvent.click(
      screen.getByRole("button", { name: "Verify & Submit Mock Claim" }),
    );

    expect(
      screen.getByText(
        "Consent is required to simulate this mock claim submission.",
      ),
    ).toBeVisible();

    // Give consent and test invalid OTP
    fireEvent.click(
      screen.getByLabelText(/I authorize ClaimSaathi to simulate/),
    );
    fireEvent.change(screen.getByLabelText("6-digit simulated OTP"), {
      target: { value: "000000" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Verify & Submit Mock Claim" }),
    );

    expect(
      await screen.findByText(
        new RegExp(`Enter the 6-digit demo code: ${DEFAULT_SIMULATED_OTP}`),
      ),
    ).toBeVisible();

    // Enter correct simulated OTP and submit
    fireEvent.change(screen.getByLabelText("6-digit simulated OTP"), {
      target: { value: DEFAULT_SIMULATED_OTP },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Verify & Submit Mock Claim" }),
    );

    // Verify receipt appears
    expect(
      await screen.findByRole("heading", {
        name: "Your mock claim has been received",
      }),
    ).toBeVisible();
    expect(screen.getByText(/ACK-2026-AV-9482/)).toBeVisible();
    expect(screen.getByText("DEMO-CLM-1001")).toBeVisible();
    expect(onSubmitted).toHaveBeenCalledOnce();

    // Test copy receipt summary
    fireEvent.click(
      screen.getByRole("button", { name: "Copy acknowledgement summary" }),
    );
    expect(screen.getByText("✓ Copied receipt")).toBeVisible();

    // Return to workspace
    fireEvent.click(
      screen.getByRole("button", { name: "Return to workspace" }),
    );
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("restores saved fictional progress after remount", () => {
    const firstRender = renderForm();
    completeNeed();
    firstRender.onBack.mockClear();
    cleanup();

    renderForm();

    expect(
      screen.getByText("Previous progress was restored in this browser."),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: "Confirm how this mock claim would be paid",
      }),
    ).toBeVisible();
  });
});
