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
        name: "Draft Statutory Grievance for Latha Nair",
      }),
    ).toBeVisible();

    const subjectInput = screen.getByLabelText("Grievance Subject");
    expect(subjectInput).toHaveValue(
      "Grievance regarding short settlement of Form 31 Housing Advance (Claim ID: DEMO-CLM-1003)",
    );

    const petitionTextarea = screen.getByLabelText("Formal Petition Text");
    expect(petitionTextarea).toHaveValue();

    expect(screen.getByText("Supporting Evidence")).toBeVisible();
    expect(screen.getByText("Claim Acknowledgement Slip")).toBeVisible();
    expect(screen.getByText("Bank Credit Statement / Passbook")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Back to workspace" }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("allows editing text, copying petition, and toggling evidence", async () => {
    const demoCase = demoDataService.loadCase("latha-settlement");
    render(<GrievanceManager demoCase={demoCase!} onBack={vi.fn()} />);

    const subjectInput = screen.getByLabelText("Grievance Subject");
    fireEvent.change(subjectInput, {
      target: { value: "Custom Subject for Regional PF Commissioner" },
    });
    expect(subjectInput).toHaveValue(
      "Custom Subject for Regional PF Commissioner",
    );

    const petitionTextarea = screen.getByLabelText("Formal Petition Text");
    fireEvent.change(petitionTextarea, {
      target: { value: "Custom revised representation body." },
    });
    expect(petitionTextarea).toHaveValue("Custom revised representation body.");

    // Toggle evidence item
    const checkbox = screen.getByLabelText(
      "Toggle evidence: Housing Estimation / Certificate",
    );
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Copy text
    fireEvent.click(
      screen.getByRole("button", { name: "Copy Petition to Clipboard" }),
    );
    expect(await screen.findByText(/Copied/i)).toBeVisible();
  });

  it("registers simulated EPFiGMS docket and enables 15-day SLA reminder", () => {
    const demoCase = demoDataService.loadCase("latha-settlement");
    render(<GrievanceManager demoCase={demoCase!} onBack={vi.fn()} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Simulate EPFiGMS Registration →",
      }),
    );

    expect(screen.getByText(/EPFiG\/E\/2026\/\d+/i)).toBeVisible();
    expect(screen.getByText("15-Day Target")).toBeVisible();

    const reminderCheckbox = screen.getByLabelText(
      "Toggle calendar SLA reminder",
    );
    expect(reminderCheckbox).toBeChecked();

    fireEvent.click(reminderCheckbox);
    expect(reminderCheckbox).not.toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: "Reset Default" }));
    expect(
      screen.getByRole("button", { name: "Simulate EPFiGMS Registration →" }),
    ).toBeVisible();
  });
});
