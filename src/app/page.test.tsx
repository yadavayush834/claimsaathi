import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

describe("HomePage", () => {
  it("explains the citizen task and offers a no-login demo entry", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Withdraw your PF without guessing what comes next.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Try the citizen journey" }),
    ).toHaveAttribute("href", "/demo");
    expect(
      screen.getByText(
        "Nothing is submitted to EPFO or another government system.",
      ),
    ).toBeVisible();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
