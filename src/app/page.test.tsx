import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

describe("HomePage", () => {
  it("renders the design-system preview inside the application shell", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "A calm interface for high-stakes moments.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Claim journey" }),
    ).toBeVisible();
    expect(
      screen.getByRole("complementary", { name: "Independent demo" }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
  });
});
