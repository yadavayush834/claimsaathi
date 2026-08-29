import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { demoDataService } from "@/lib/demo/demo-service";
import type { DemoPersonaId } from "@/lib/demo/model";

import { RejectionRecoveryJourney } from "./rejection-recovery-journey";

afterEach(cleanup);

function renderRecovery(personaId: DemoPersonaId = "imran-returned") {
  const demoCase = demoDataService.loadCase(personaId);
  const onBack = vi.fn();
  const onOpenPreflight = vi.fn();
  const onStartResubmission = vi.fn();
  const onViewTimeline = vi.fn();

  expect(demoCase).not.toBeNull();
  render(
    <RejectionRecoveryJourney
      demoCase={demoCase!}
      onBack={onBack}
      onOpenPreflight={onOpenPreflight}
      onStartResubmission={onStartResubmission}
      onViewTimeline={onViewTimeline}
    />,
  );

  return { onBack, onOpenPreflight, onStartResubmission, onViewTimeline };
}

describe("RejectionRecoveryJourney", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders rejection diagnosis and guided checklist for Imran", () => {
    const { onBack, onOpenPreflight } = renderRecovery("imran-returned");

    expect(
      screen.getByRole("heading", {
        name: "Fix & Recover Imran Sheikh's Claim",
      }),
    ).toBeVisible();
    expect(screen.getByText("Bank Account Name Mismatch")).toBeVisible();
    expect(screen.getByText(/Verify full name on bank passbook/)).toBeVisible();
    expect(
      screen.getByText(/Employer digital signature approval/),
    ).toBeVisible();

    // Check preflight button
    fireEvent.click(
      screen.getByRole("button", {
        name: "Open Readiness Preflight Check →",
      }),
    );
    expect(onOpenPreflight).toHaveBeenCalledOnce();

    // Check back button
    fireEvent.click(screen.getByRole("button", { name: "Back to workspace" }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("completes all checklist steps and enables clean mock resubmission", () => {
    const { onStartResubmission } = renderRecovery("imran-returned");

    // Click Simulate all steps complete
    fireEvent.click(
      screen.getByRole("button", {
        name: "Simulate all steps complete",
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: "Ready to submit clean mock claim",
      }),
    ).toBeVisible();

    // Click resubmission
    fireEvent.click(
      screen.getByRole("button", {
        name: "Proceed to clean mock resubmission →",
      }),
    );
    expect(onStartResubmission).toHaveBeenCalledOnce();
  });
});
