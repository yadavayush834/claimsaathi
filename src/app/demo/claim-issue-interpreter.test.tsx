import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { demoDataService } from "@/lib/demo/demo-service";
import type { DemoPersonaId } from "@/lib/demo/model";

import { ClaimIssueInterpreter } from "./claim-issue-interpreter";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

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
        name: "Translate & Resolve Portal Remarks",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: "Diagnostic Breakdown",
      }),
    ).toBeVisible();
    expect(screen.getByText("Recommended Next Steps")).toBeVisible();

    // Test preflight navigation
    fireEvent.click(
      screen.getByRole("button", {
        name: "Open KYC Preflight Checks →",
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
      screen.getByRole("button", { name: "Analyze Remark with AI →" }),
    );

    const copyBtn = await screen.findByRole("button", {
      name: "Copy Diagnostic Summary",
    });
    expect(copyBtn).toBeVisible();

    // Test copy action summary
    fireEvent.click(copyBtn);
    expect(await screen.findByText(/Copied/i)).toBeVisible();
  });

  it("blocks a sensitive identifier before the AI analysis request", () => {
    renderInterpreter("imran-returned");

    fireEvent.change(screen.getByLabelText("Portal remark text for analysis"), {
      target: { value: "My UAN is 109988776655" },
    });

    expect(screen.getByText("Privacy & Safety Notice")).toBeVisible();
    expect(
      screen.getByLabelText("Portal remark text for analysis"),
    ).not.toHaveValue("My UAN is 109988776655");
  });

  it("labels rate-limited AI behavior and keeps the local guidance usable", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: false, error: "rate limited" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }),
    );
    renderInterpreter("imran-returned");

    fireEvent.click(
      screen.getByRole("button", { name: "Analyze Remark with AI →" }),
    );

    expect(
      await screen.findByText(
        "The demo AI request limit was reached. Local rule-based guidance is shown instead.",
      ),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Diagnostic Breakdown" }),
    ).toBeVisible();
  });
});
