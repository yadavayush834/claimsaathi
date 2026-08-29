import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { demoDataService } from "@/lib/demo/demo-service";
import type { DemoPersonaId } from "@/lib/demo/model";

import { ClaimIssueInterpreter } from "./claim-issue-interpreter";

afterEach(cleanup);

function renderInterpreter(personaId: DemoPersonaId = "imran-returned") {
  const demoCase = demoDataService.loadCase(personaId);
  const onBack = vi.fn();
  const onOpenPreflight = vi.fn();

  expect(demoCase).not.toBeNull();
  render(
    <ClaimIssueInterpreter
      demoCase={demoCase!}
      onBack={onBack}
      onOpenPreflight={onOpenPreflight}
    />,
  );

  return { onBack, onOpenPreflight };
}

describe("ClaimIssueInterpreter", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders diagnostic output for initial remark", () => {
    const { onBack, onOpenPreflight } = renderInterpreter("imran-returned");

    expect(
      screen.getByRole("heading", {
        name: "Claim Issue & Rejection Interpreter",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: "Bank Account Name Mismatch",
      }),
    ).toBeVisible();
    expect(screen.getByText("Step-by-step action checklist")).toBeVisible();
    expect(screen.getAllByText(/Action Owner:/)[0]).toBeVisible();

    // Test preflight navigation
    fireEvent.click(
      screen.getByRole("button", {
        name: "Check readiness preflight checklist →",
      }),
    );
    expect(onOpenPreflight).toHaveBeenCalledOnce();

    // Test back button
    fireEvent.click(screen.getByRole("button", { name: "Back to workspace" }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("translates preset remarks and copies diagnostic summary", async () => {
    renderInterpreter("imran-returned");

    // Select Medical Certificate preset
    fireEvent.click(
      screen.getByRole("button", {
        name: "Medical certificate missing (Para 68J)",
      }),
    );

    // Click Analyze
    fireEvent.click(
      screen.getByRole("button", { name: "Translate & Analyze Issue →" }),
    );

    expect(
      await screen.findByRole("heading", {
        name: "Missing or Incomplete Medical Evidence",
      }),
    ).toBeVisible();
    expect(screen.getAllByText(/EPF Scheme 1952 Para 68J/)[0]).toBeVisible();

    // Test copy action summary
    fireEvent.click(
      screen.getByRole("button", { name: "Copy action summary" }),
    );
    expect(screen.getByText("✓ Copied checklist")).toBeVisible();
  });
});
