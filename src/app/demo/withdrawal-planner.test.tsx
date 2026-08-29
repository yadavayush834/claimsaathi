import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { demoDataService } from "@/lib/demo/demo-service";
import { ELIGIBILITY_POLICY_SOURCE_URL } from "@/lib/eligibility/policy";

import { WithdrawalPlanner } from "./withdrawal-planner";

function renderPlanner() {
  const demoCase = demoDataService.loadCase("asha-planning");
  expect(demoCase).not.toBeNull();
  const onBack = vi.fn();
  const onStartMockClaim = vi.fn();
  render(
    <WithdrawalPlanner
      demoCase={demoCase!}
      onBack={onBack}
      onStartMockClaim={onStartMockClaim}
    />,
  );
  return { onBack, onStartMockClaim };
}

function continueToResult() {
  fireEvent.click(screen.getByRole("button", { name: "Continue to details" }));
  fireEvent.click(screen.getByRole("button", { name: "Continue to amount" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Calculate mock result" }),
  );
}

describe("WithdrawalPlanner", () => {
  it("guides the citizen to an explainable eligible amount", () => {
    const { onStartMockClaim } = renderPlanner();

    expect(
      screen.getByRole("heading", { name: "Plan a mock PF withdrawal" }),
    ).toBeVisible();
    expect(screen.getByLabelText("Medical treatment")).toBeChecked();

    continueToResult();

    expect(screen.getByText("Eligible in this demo")).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: "Up to ₹75,000 in this demo",
      }),
    ).toBeVisible();
    expect(screen.getByText("Protected pension share")).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Review EPFO source guidelines/ }),
    ).toHaveAttribute("href", ELIGIBILITY_POLICY_SOURCE_URL);

    fireEvent.click(
      screen.getByRole("button", { name: "Start simplified mock claim →" }),
    );
    expect(onStartMockClaim).toHaveBeenCalledOnce();
  });

  it("explains when the service check is not met", () => {
    renderPlanner();

    fireEvent.click(
      screen.getByRole("button", { name: "Continue to details" }),
    );
    fireEvent.change(screen.getByLabelText("Total service in months"), {
      target: { value: "11" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continue to amount" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Calculate mock result" }),
    );

    expect(screen.getByText("Not eligible in this demo")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "₹0 under these answers" }),
    ).toBeVisible();
    expect(
      screen.getAllByText("Minimum service is the first unmet rule.").length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("Fail")).toBeVisible();
  });
});
