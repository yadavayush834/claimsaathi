import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

describe("HomePage", () => {
  it("renders the project name and foundation status", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "ClaimSaathi" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Application foundation ready.")).toBeVisible();
  });
});
