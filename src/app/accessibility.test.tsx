import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import HomePage from "./page";
import DemoPage from "./demo/page";

afterEach(cleanup);

describe("Accessibility & Semantic Structure", () => {
  it("renders a skip-to-content link targeting #main-content on Home Page", () => {
    render(<HomePage />);
    const skipLink = screen.getByRole("link", {
      name: /Skip to main content/i,
    });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  it("ensures main landmark has id main-content on Home Page", () => {
    render(<HomePage />);
    const mainElement = screen.getByRole("main");
    expect(mainElement).toHaveAttribute("id", "main-content");
  });

  it("renders a skip link and main landmark on Demo Page", () => {
    render(<DemoPage />);
    const skipLink = screen.getByRole("link", {
      name: /Skip to main content/i,
    });
    expect(skipLink).toBeInTheDocument();
    const mainElement = screen.getByRole("main");
    expect(mainElement).toHaveAttribute("id", "main-content");
  });
});
