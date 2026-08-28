import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TextField } from "./text-field";

describe("TextField", () => {
  it("associates its label, guidance, and error with the input", () => {
    render(
      <TextField
        id="reference"
        label="Claim reference"
        hint="Use synthetic information."
        error="Check the reference format."
      />,
    );

    const input = screen.getByRole("textbox", { name: "Claim reference" });

    expect(input).toHaveAccessibleDescription(
      "Use synthetic information. Check the reference format.",
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});
