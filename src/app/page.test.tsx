import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

describe("HomePage", () => {
  it("explains the citizen task and offers a no-login demo entry", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /PF withdrawal guidance/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /Explore Interactive Demo/i })[0],
    ).toHaveAttribute("href", "/demo");
    expect(
      screen.getByText(/Safety & Non-Affiliation Guarantees/i),
    ).toBeVisible();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
