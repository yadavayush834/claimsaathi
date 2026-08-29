import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JourneyPreview } from "./journey-preview";

describe("JourneyPreview", () => {
  it("lets a citizen explore each part of the claim route", () => {
    render(<JourneyPreview />);

    const plan = screen.getByRole("button", { name: "Plan" });
    const track = screen.getByRole("button", { name: "Track" });

    expect(plan).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("heading", { name: "Know what the numbers mean." }),
    ).toBeVisible();

    fireEvent.click(track);

    expect(track).toHaveAttribute("aria-pressed", "true");
    expect(plan).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByRole("heading", {
        name: "A status becomes a next action.",
      }),
    ).toBeVisible();
    expect(screen.getByText("Under review")).toBeVisible();
  });
});
