import { describe, expect, it } from "vitest";

import { DEFAULT_SIMULATED_OTP } from "@/lib/demo/mock-claim-submission-service";

import { POST } from "./route";

describe("POST /api/demo/submit-claim", () => {
  it("returns 200 and receipt for valid submission", async () => {
    const request = new Request("http://localhost:3000/api/demo/submit-claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personaId: "asha-planning",
        treatmentNeed: "Fictional outpatient treatment",
        fictionalCity: "Faridabad",
        notificationRoute: "browser",
        bankConfirmed: true,
        declarationConfirmed: true,
        consentConfirmed: true,
        simulatedOtp: DEFAULT_SIMULATED_OTP,
        requestedAmountRupees: 75000,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const json = (await response.json()) as {
      ok: boolean;
      receipt: { acknowledgementNumber: string; claimReference: string };
    };
    expect(json.ok).toBe(true);
    expect(json.receipt.acknowledgementNumber).toContain("ACK-2026-AV");
    expect(json.receipt.claimReference).toBe("DEMO-CLM-1001");
  });

  it("returns 400 when simulated OTP is incorrect", async () => {
    const request = new Request("http://localhost:3000/api/demo/submit-claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personaId: "asha-planning",
        treatmentNeed: "Fictional outpatient treatment",
        fictionalCity: "Faridabad",
        notificationRoute: "browser",
        bankConfirmed: true,
        declarationConfirmed: true,
        consentConfirmed: true,
        simulatedOtp: "000000",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const json = (await response.json()) as { ok: boolean; error: string };
    expect(json.ok).toBe(false);
    expect(json.error).toContain(DEFAULT_SIMULATED_OTP);
  });
});
