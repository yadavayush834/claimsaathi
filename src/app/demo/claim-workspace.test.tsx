import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { demoDataService } from "@/lib/demo/demo-service";

import { ClaimWorkspace } from "./claim-workspace";

afterEach(cleanup);

describe("ClaimWorkspace", () => {
  it("shows the complete Phase 05 snapshot and one next action for Imran", () => {
    const demoCase = demoDataService.loadCase("imran-returned");
    const onSwitch = vi.fn();
    const onViewTimeline = vi.fn();
    const onExplainIssue = vi.fn();
    const onStartRecovery = vi.fn();

    expect(demoCase).not.toBeNull();
    render(
      <ClaimWorkspace
        demoCase={demoCase!}
        sessionMessage="Session restored after refresh."
        onSwitch={onSwitch}
        onViewTimeline={onViewTimeline}
        onExplainIssue={onExplainIssue}
        onStartRecovery={onStartRecovery}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Imran Sheikh" }),
    ).toBeVisible();
    expect(
      screen.getByRole("region", { name: /Synthetic PF balance/ }),
    ).toHaveTextContent(/1,57,400/);
    expect(
      screen.getByRole("region", { name: /Active claim/ }),
    ).toHaveTextContent("DEMO-CLM-1002");
    expect(screen.getByText("Issue state")).toBeVisible();
    expect(
      screen.getByText("Fictional bank name does not match"),
    ).toBeVisible();
    expect(
      screen.getByRole("region", { name: "Recent events" }),
    ).toHaveTextContent("Mock claim submitted");
    expect(
      screen.getByRole("region", {
        name: "Run the fictional readiness preflight",
      }),
    ).toBeVisible();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Start rejection recovery journey →",
      }),
    );
    expect(onStartRecovery).toHaveBeenCalledOnce();

    fireEvent.click(
      screen.getByRole("button", { name: "Explain with AI Interpreter →" }),
    );
    expect(onExplainIssue).toHaveBeenCalledOnce();

    fireEvent.click(
      screen.getByRole("button", { name: "Track claim timeline →" }),
    );
    expect(onViewTimeline).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole("button", { name: /Switch citizen/ }));
    expect(onSwitch).toHaveBeenCalledOnce();
  });

  it("shows settlement comparison action for Latha Nair", () => {
    const demoCase = demoDataService.loadCase("latha-settlement");
    const onReconcileSettlement = vi.fn();

    expect(demoCase).not.toBeNull();
    render(
      <ClaimWorkspace
        demoCase={demoCase!}
        sessionMessage="Session restored after refresh."
        onSwitch={vi.fn()}
        onReconcileSettlement={onReconcileSettlement}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Latha Nair" }),
    ).toBeVisible();
    expect(
      screen.getByRole("region", { name: /Synthetic PF balance/ }),
    ).toHaveTextContent(/2,95,500/);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Compare mock settlement amounts →",
      }),
    );
    expect(onReconcileSettlement).toHaveBeenCalledOnce();
  });
});
