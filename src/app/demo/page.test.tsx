import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DemoPage from "./page";

describe("DemoPage", () => {
  it("opens the synthetic demo without asking for credentials", () => {
    render(<DemoPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "You're in demo mode." }),
    ).toBeInTheDocument();
    expect(screen.getByText("No login required")).toBeVisible();
    expect(screen.getByText("Not requested")).toBeVisible();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
