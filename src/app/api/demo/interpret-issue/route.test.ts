import { describe, expect, it } from "vitest";

import type { InterpretationResponse } from "@/lib/ai/interpreter-model";

import { POST } from "./route";

describe("POST /api/demo/interpret-issue", () => {
  it("returns 200 and structured interpretation for valid request", async () => {
    const req = new Request("http://localhost:3000/api/demo/interpret-issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rawStatusText: "MEMBER NAME IN BANK KYC DOES NOT MATCH WITH UAN RECORD",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = (await res.json()) as InterpretationResponse;
    expect(json.ok).toBe(true);
    if (json.ok) {
      expect(json.interpretation.category).toBe("bank_error");
      expect(json.interpretation.citedNextSteps.length).toBeGreaterThan(0);
      expect(json.interpretation.synthetic).toBe(true);
    }
  });

  it("returns 400 when rawStatusText is missing or empty", async () => {
    const req = new Request("http://localhost:3000/api/demo/interpret-issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawStatusText: "   " }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = (await res.json()) as { ok: boolean; error: string };
    expect(json.ok).toBe(false);
    expect(json.error).toContain("provide a portal remark");
  });
});
