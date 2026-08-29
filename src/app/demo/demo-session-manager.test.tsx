import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { DEMO_SESSION_STORAGE_KEY } from "@/lib/demo/session-store";

import { DemoSessionManager } from "./demo-session-manager";

afterEach(cleanup);

describe("DemoSessionManager", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts and restores a synthetic citizen session", async () => {
    const firstRender = render(<DemoSessionManager />);

    expect(
      await screen.findByRole("heading", {
        level: 2,
        name: "Choose a fictional citizen",
      }),
    ).toBeVisible();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Start Asha Verma's demo case",
      }),
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Asha Verma" }),
    ).toBeVisible();
    expect(screen.getByText("DEMO-CLM-1001")).toBeVisible();
    fireEvent.click(
      screen.getByRole("button", { name: "Plan mock withdrawal" }),
    );
    expect(
      screen.getByRole("heading", { name: "Plan a mock PF withdrawal" }),
    ).toBeVisible();
    expect(
      JSON.parse(
        window.localStorage.getItem(DEMO_SESSION_STORAGE_KEY) ?? "null",
      ),
    ).toEqual({ version: 1, personaId: "asha-planning" });

    firstRender.unmount();
    render(<DemoSessionManager />);

    expect(
      await screen.findByText(/Session restored after refresh/),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 2, name: "Asha Verma" }),
    ).toBeVisible();
  });

  it("opens the readiness preflight from the returned fictional case", async () => {
    render(<DemoSessionManager />);

    await screen.findByRole("heading", {
      level: 2,
      name: "Choose a fictional citizen",
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Start Imran Sheikh's demo case",
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Explain with AI Interpreter →" }),
    );

    expect(
      screen.getByRole("heading", {
        name: "Translate & Resolve Portal Remarks",
      }),
    ).toBeVisible();
  });

  it("navigates through eligibility planning into the mock claim form and back", async () => {
    render(<DemoSessionManager />);

    await screen.findByRole("heading", {
      level: 2,
      name: "Choose a fictional citizen",
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Start Asha Verma's demo case",
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Plan mock withdrawal" }),
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Continue to details" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Continue to amount" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Calculate mock result" }),
    );

    expect(
      screen.getByRole("heading", { name: /Up to ₹75,000/ }),
    ).toBeVisible();

    fireEvent.click(
      screen.getByRole("button", { name: "Start simplified mock claim →" }),
    );

    expect(
      screen.getByRole("heading", {
        name: "Add the details for this mock claim",
      }),
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Back to workspace" }));

    expect(
      screen.getByRole("heading", { level: 2, name: "Asha Verma" }),
    ).toBeVisible();
  });

  it("navigates into the claim status timeline from the workspace", async () => {
    render(<DemoSessionManager />);

    await screen.findByRole("heading", {
      level: 2,
      name: "Choose a fictional citizen",
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Start Latha Nair's demo case",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Track claim timeline →" }),
    );

    expect(
      screen.getByRole("heading", { name: "Latha Nair's Claim Timeline" }),
    ).toBeVisible();
    expect(screen.getByText("Lifecycle Stages")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Back to workspace" }));

    expect(
      screen.getByRole("heading", { level: 2, name: "Latha Nair" }),
    ).toBeVisible();
  });

  it("navigates into the rejection recovery journey from the workspace", async () => {
    render(<DemoSessionManager />);

    await screen.findByRole("heading", {
      level: 2,
      name: "Choose a fictional citizen",
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Start Imran Sheikh's demo case",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Start rejection recovery journey →",
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: "Fix & Recover Imran Sheikh's Claim",
      }),
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Back to workspace" }));

    expect(
      screen.getByRole("heading", { level: 2, name: "Imran Sheikh" }),
    ).toBeVisible();
  });

  it("navigates into settlement reconciliation and grievance preparation for Latha Nair", async () => {
    render(<DemoSessionManager />);

    await screen.findByRole("heading", {
      level: 2,
      name: "Choose a fictional citizen",
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Start Latha Nair's demo case",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Compare mock settlement amounts →",
      }),
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Reconcile Latha Nair's Settled Claim",
      }),
    ).toBeVisible();

    // Dispute calculation to open grievance
    fireEvent.click(
      screen.getByRole("button", {
        name: "Dispute via Grievance →",
      }),
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Draft Statutory Grievance for Latha Nair",
      }),
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Back to workspace" }));

    expect(
      screen.getByRole("heading", { level: 2, name: "Latha Nair" }),
    ).toBeVisible();
  });
});
