import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { demoDataService } from "@/lib/demo/demo-service";

import { ClaimWorkspace } from "./claim-workspace";

describe("ClaimWorkspace", () => {
  it("shows the complete Phase 05 snapshot and one next action", () => {
    const demoCase = demoDataService.loadCase("imran-returned");
    const onSwitch = vi.fn();

    expect(demoCase).not.toBeNull();
    render(
      <ClaimWorkspace
        demoCase={demoCase!}
        sessionMessage="Session restored after refresh."
        onSwitch={onSwitch}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Imran Sheikh" }),
    ).toBeVisible();
    expect(
      screen.getByRole("region", { name: "Synthetic PF balance" }),
    ).toHaveTextContent("₹1,57,400");
    expect(
      screen.getByRole("region", { name: "Active claim" }),
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
    expect(
      screen.getByText("Balance on record is not an eligibility result."),
    ).toBeVisible();

    fireEvent.click(
      screen.getByRole("button", { name: "Switch demo citizen" }),
    );
    expect(onSwitch).toHaveBeenCalledOnce();
  });
});
