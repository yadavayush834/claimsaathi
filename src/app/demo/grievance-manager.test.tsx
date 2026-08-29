import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { demoDataService } from "@/lib/demo/demo-service";

import { GrievanceManager } from "./grievance-manager";

afterEach(cleanup);

describe("GrievanceManager", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders editable petition fields and evidence checklist for Latha Nair", () => {
    const demoCase = demoDataService.loadCase("latha-settlement");
    expect(demoCase).not.toBeNull();
    const onBack = vi.fn();

    render(<GrievanceManager demoCase={demoCase!} onBack={onBack} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Prepare Grievance for Latha Nair",
      }),
    ).toBeVisible();

    const subjectInput = screen.getByLabelText("Subject Line");
    expect(subjectInput).toHaveValue(
      "Grievance regarding short settlement of Form 31 Housing Advance (Claim ID: DEMO-CLM-1003)",
    );

    const petitionTextarea = screen.getByLabelText(
      "Petition Letter Body (Editable)",
    );
    expect(petitionTextarea).toHaveValue();

    expect(screen.getByText("Supporting Evidence Checklist")).toBeVisible();
    expect(screen.getByText("Claim Acknowledgement Slip")).toBeVisible();
    expect(screen.getByText("Bank Credit Statement / Passbook")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Back to workspace" }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("allows editing text, copying petition, and toggling evidence", async () => {
    const demoCase = demoDataService.loadCase("latha-settlement");
    render(<GrievanceManager demoCase={demoCase!} onBack={vi.fn()} />);

    const subjectInput = screen.getByLabelText("Subject Line");
    fireEvent.change(subjectInput, {
      target: { value: "Custom Subject for Regional PF Commissioner" },
    });
    expect(subjectInput).toHaveValue(
      "Custom Subject for Regional PF Commissioner",
    );

    const petitionTextarea = screen.getByLabelText(
      "Petition Letter Body (Editable)",
    );
    fireEvent.change(petitionTextarea, {
      target: { value: "Custom revised representation body." },
    });
    expect(petitionTextarea).toHaveValue("Custom revised representation body.");

    // Toggle evidence item
    const checkbox = screen.getByLabelText(
      "Attach Housing Estimation / Certificate",
    );
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Copy text
    fireEvent.click(screen.getByRole("button", { name: "Copy petition text" }));
    expect(await screen.findByText("✓ Copied to clipboard!")).toBeVisible();
  });

  it("registers simulated EPFiGMS docket and enables 15-day SLA reminder", () => {
    const demoCase = demoDataService.loadCase("latha-settlement");
    render(<GrievanceManager demoCase={demoCase!} onBack={vi.fn()} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Register on simulated EPFiGMS →",
      }),
    );

    expect(screen.getByText(/Docket Ref: EPFiG\/E\/2026\/\d+/)).toBeVisible();
    expect(screen.getByText("⏱ 15 Days SLA Target")).toBeVisible();
    expect(screen.getByText("✓ SLA Reminder Active")).toBeVisible();

    fireEvent.click(
      screen.getByRole("button", { name: "✓ SLA Reminder Active" }),
    );
    expect(screen.getByText("+ Enable SLA Reminder")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Reset to draft" }));
    expect(
      screen.getByRole("button", {
        name: "Register on simulated EPFiGMS →",
      }),
    ).toBeVisible();
  });
});
