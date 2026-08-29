import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { demoDataService } from "@/lib/demo/demo-service";
import { MOCK_CLAIM_DRAFT_STORAGE_KEY } from "@/lib/demo/mock-claim-draft-store";

import { MockClaimForm } from "./mock-claim-form";

afterEach(cleanup);

function renderForm() {
  const demoCase = demoDataService.loadCase("asha-planning");
  const onBack = vi.fn();

  expect(demoCase).not.toBeNull();
  render(<MockClaimForm demoCase={demoCase!} onBack={onBack} />);

  return { onBack };
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

describe("MockClaimForm", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows actionable errors instead of allowing an empty mock claim", () => {
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

  it("saves a fictional draft through the declaration step", () => {
    const { onBack } = renderForm();

    completeNeed();
    fireEvent.click(
      screen.getByLabelText(
        "I checked this fictional bank record for the demo.",
      ),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Continue to declaration" }),
    );
    fireEvent.click(
      screen.getByLabelText("I confirm this fictional declaration."),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Save mock claim details" }),
    );

    expect(
      screen.getByRole("heading", { name: "Ready for the review step." }),
    ).toBeVisible();
    expect(
      JSON.parse(
        window.localStorage.getItem(MOCK_CLAIM_DRAFT_STORAGE_KEY) ?? "null",
      ),
    ).toMatchObject({
      personaId: "asha-planning",
      treatmentNeed: "Fictional outpatient treatment",
      fictionalCity: "Faridabad",
      bankConfirmed: true,
      declarationConfirmed: true,
    });

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
