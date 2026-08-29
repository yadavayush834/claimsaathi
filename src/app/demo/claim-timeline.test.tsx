import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { demoDataService } from "@/lib/demo/demo-service";
import type { DemoPersonaId } from "@/lib/demo/model";

import { ClaimTimeline } from "./claim-timeline";

afterEach(cleanup);

function renderTimeline(personaId: DemoPersonaId = "asha-planning") {
  const demoCase = demoDataService.loadCase(personaId);
  const onBack = vi.fn();

  expect(demoCase).not.toBeNull();
  render(<ClaimTimeline demoCase={demoCase!} onBack={onBack} />);

  return { onBack };
}

describe("ClaimTimeline", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders claim milestones and initial status for Asha", () => {
    const { onBack } = renderTimeline("asha-planning");

    expect(
      screen.getByRole("heading", { name: "Asha Verma's Claim Status" }),
    ).toBeVisible();
    expect(screen.getByText("1. Submission")).toBeVisible();
    expect(screen.getByText("2. Field review")).toBeVisible();
    expect(screen.getByText("3. Sanction & approval")).toBeVisible();
    expect(screen.getByText("4. Settlement")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Back to workspace" }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("advances through lifecycle states and adds realistic event logs", () => {
    renderTimeline("asha-planning");

    // Advance 1: draft -> submitted
    fireEvent.click(
      screen.getByRole("button", { name: "Advance simulated status →" }),
    );
    expect(screen.getAllByText("Submitted in demo").length).toBeGreaterThan(0);

    // Advance 2: submitted -> under_process
    fireEvent.click(
      screen.getByRole("button", { name: "Advance simulated status →" }),
    );
    expect(screen.getAllByText("Under field review").length).toBeGreaterThan(0);
    expect(screen.getByText("Under field office review")).toBeVisible();

    // Advance 3: under_process -> approved
    fireEvent.click(
      screen.getByRole("button", { name: "Advance simulated status →" }),
    );
    expect(screen.getAllByText("Approved & sanctioned").length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText("Sanction order approved")).toBeVisible();

    // Advance 4: approved -> settled
    fireEvent.click(
      screen.getByRole("button", { name: "Advance simulated status →" }),
    );
    expect(screen.getAllByText("Settled in demo").length).toBeGreaterThan(0);
    expect(screen.getByText("Settlement completed")).toBeVisible();

    // Reset back to baseline
    fireEvent.click(screen.getByRole("button", { name: "Reset to baseline" }));
    expect(screen.getAllByText("Draft ready").length).toBeGreaterThan(0);
  });
});
