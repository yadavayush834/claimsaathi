import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { demoDataService } from "@/lib/demo/demo-service";

import { KycPreflight } from "./kyc-preflight";

afterEach(cleanup);

function renderPreflight() {
  const demoCase = demoDataService.loadCase("imran-returned");
  const onBack = vi.fn();

  expect(demoCase).not.toBeNull();
  render(<KycPreflight demoCase={demoCase!} onBack={onBack} />);

  return { onBack };
}

function resolveSelectedCheck() {
  fireEvent.click(
    screen.getByLabelText(
      "I completed these fictional correction steps for this demo.",
    ),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Mark this check ready" }),
  );
}

describe("KycPreflight", () => {
  it("shows synthetic identity, bank, and evidence issues with a clear owner", () => {
    renderPreflight();

    expect(
      screen.getByRole("heading", { name: "Check what needs fixing first" }),
    ).toBeVisible();
    expect(
      screen.getByText("3 fictional records need attention."),
    ).toBeVisible();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Review Bank: Name on bank account",
      }),
    );

    expect(screen.getByText("Imran S. Sheikh")).toBeVisible();
    expect(screen.getByText("Citizen and bank record")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Mark this check ready" }),
    ).toBeDisabled();
  });

  it("lets the user clear every fictional preflight check before returning", () => {
    const { onBack } = renderPreflight();

    resolveSelectedCheck();
    resolveSelectedCheck();
    resolveSelectedCheck();

    expect(
      screen.getByRole("heading", {
        name: "All three fictional readiness checks are clear.",
      }),
    ).toBeVisible();
    expect(
      screen.getByText(
        "The next mock claim form is intentionally not available until a later phase of this prototype.",
      ),
    ).toBeVisible();

    fireEvent.click(
      screen.getByRole("button", { name: "Return to workspace" }),
    );
    expect(onBack).toHaveBeenCalledOnce();
  });
});
