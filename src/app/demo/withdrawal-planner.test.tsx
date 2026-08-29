import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { demoDataService } from "@/lib/demo/demo-service";
import { ELIGIBILITY_POLICY_SOURCE_URL } from "@/lib/eligibility/policy";

import { WithdrawalPlanner } from "./withdrawal-planner";

function renderPlanner() {
  const demoCase = demoDataService.loadCase("asha-planning");
  expect(demoCase).not.toBeNull();
  const onBack = vi.fn();
  render(<WithdrawalPlanner demoCase={demoCase!} onBack={onBack} />);
  return { onBack };
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
    renderPlanner();

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
    expect(screen.getByText("Protected 25%")).toBeVisible();
    expect(
      screen.getByText(/Pension share excluded from this calculation/),
    ).toHaveTextContent("₹31,700");
    expect(
      screen.getByRole("link", { name: /official EPFO press brief/ }),
    ).toHaveAttribute("href", ELIGIBILITY_POLICY_SOURCE_URL);
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
      screen.getByText("Minimum service is the first unmet rule."),
    ).toBeVisible();
    expect(screen.getByText("Not met")).toBeVisible();
  });
});
