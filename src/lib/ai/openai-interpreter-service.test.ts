import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { interpretClaimIssue } from "./openai-interpreter-service";

describe("openai-interpreter-service", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("safely falls back to deterministic rule engine when OPENAI_API_KEY is not set", async () => {
    delete process.env.OPENAI_API_KEY;

    const result = await interpretClaimIssue({
      rawStatusText: "MEMBER NAME IN BANK KYC DOES NOT MATCH WITH UAN RECORD",
    });

    expect(result.isFallback).toBe(true);
    expect(result.modelUsed).toBe("offline-rule-engine-v1");
    expect(result.category).toBe("bank_error");
    expect(result.plainLanguageExplanation).toContain("spelling of your name");
  });

  it("uses OpenAI API when OPENAI_API_KEY is provided and response is valid", async () => {
    process.env.OPENAI_API_KEY = "mock-test-key";
    process.env.OPENAI_MODEL = "gpt-4o-mini";

    const mockAiResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              category: "kyc_mismatch",
              categoryLabel: "Date of Birth Discrepancy",
              severity: "blocker",
              confidence: "high",
              plainLanguageExplanation:
                "Your date of birth does not match Aadhaar records.",
              rootCause: "Aadhaar date differs from EPFO records.",
              citedNextSteps: [
                {
                  order: 1,
                  step: "File Joint Declaration.",
                  owner: "Citizen",
                  officialRuleCitation: "Joint Declaration SOP 2023",
                },
              ],
            }),
          },
        },
      ],
    };

    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify(mockAiResponse), { status: 200 }),
    );

    const result = await interpretClaimIssue({
      rawStatusText: "DOB mismatch in record",
    });

    expect(result.isFallback).toBe(false);
    expect(result.modelUsed).toBe("gpt-4o-mini");
    expect(result.category).toBe("kyc_mismatch");
    expect(result.citedNextSteps[0].step).toBe("File Joint Declaration.");
  });

  it("gracefully falls back when OpenAI API returns 500 error", async () => {
    process.env.OPENAI_API_KEY = "mock-test-key";

    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response("Internal Server Error", { status: 500 }),
    );

    const result = await interpretClaimIssue({
      rawStatusText: "DOB mismatch in record",
    });

    expect(result.isFallback).toBe(true);
    expect(result.category).toBe("kyc_mismatch");
  });
});
