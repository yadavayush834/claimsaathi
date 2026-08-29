import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { demoDataService } from "@/lib/demo/demo-service";

import { SettlementReconciliation } from "./settlement-reconciliation";

afterEach(cleanup);

describe("SettlementReconciliation", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders 3 comparison metric cards and confirmed facts ledger", () => {
    const demoCase = demoDataService.loadCase("latha-settlement");
    expect(demoCase).not.toBeNull();
    const onBack = vi.fn();

    render(<SettlementReconciliation demoCase={demoCase!} onBack={onBack} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Reconcile Latha Nair's Settled Claim",
      }),
    ).toBeVisible();

    expect(screen.getByText("1. Requested Advance")).toBeVisible();
    expect(screen.getByText("2. Statutory Eligible Cap")).toBeVisible();
    expect(screen.getByText("3. Actually Disbursed")).toBeVisible();

    // Check amounts
    expect(screen.getAllByText(/1,10,000/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/92,000/).length).toBeGreaterThanOrEqual(2);

    // Confirmed facts
    expect(screen.getByText("Verified Facts Ledger")).toBeVisible();
    expect(screen.getByText("Employee Share Balance on Record")).toBeVisible();
    expect(screen.getAllByText(/1,82,500/).length).toBeGreaterThanOrEqual(1);

    // Deductions & Citations
    expect(
      screen.getByText("Statutory 24-Month Wage Ceiling Cap"),
    ).toBeVisible();
    expect(screen.getByText(/EPF Scheme 1952 Para 68B\(2\)/)).toBeVisible();

    // Back button
    fireEvent.click(screen.getByRole("button", { name: "Back to workspace" }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("handles resolution transitions to reconciled and grievance dispute", () => {
    const demoCase = demoDataService.loadCase("latha-settlement");
    const onPrepareGrievance = vi.fn();

    render(
      <SettlementReconciliation
        demoCase={demoCase!}
        onBack={vi.fn()}
        onPrepareGrievance={onPrepareGrievance}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /Accept Reconciled Amount/i,
      }),
    );

    expect(screen.getByText("Settlement Accepted")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /Reset Resolution/i }));

    fireEvent.click(
      screen.getByRole("button", {
        name: /Dispute via Grievance/i,
      }),
    );

    expect(onPrepareGrievance).toHaveBeenCalledOnce();
    expect(screen.getByText("Disputed / Grievance")).toBeVisible();
  });
});
