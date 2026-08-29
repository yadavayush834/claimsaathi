import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { DEMO_SESSION_STORAGE_KEY } from "@/lib/demo/session-store";

import { DemoSessionManager } from "./demo-session-manager";

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
      screen.getByRole("button", { name: "Run readiness preflight" }),
    );

    expect(
      screen.getByRole("heading", { name: "Check what needs fixing first" }),
    ).toBeVisible();
  });
});
