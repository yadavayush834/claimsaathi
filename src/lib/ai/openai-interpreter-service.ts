import {
  INTERPRETER_VERSION,
  type ClaimIssueCategory,
  type ClaimIssueInterpretation,
  type InterpretationRequest,
} from "./interpreter-model";
import { interpretWithRuleFallback } from "./rule-fallback-interpreter";

const SYSTEM_PROMPT = `You are ClaimSaathi's AI Civic Issue Interpreter for Indian Employees' Provident Fund (EPFO) withdrawal and transfer claims.
Your purpose is to translate cryptic, bureaucratic portal status remarks, rejection notices, and SMS updates into empathetic, crystal-clear plain language diagnostics for Indian citizens.

You must respond ONLY with a valid JSON object matching this schema:
{
  "category": "kyc_mismatch" | "bank_error" | "service_eligibility" | "missing_evidence" | "duplicate_claim" | "unexplained_rejection" | "settlement_difference" | "other",
  "categoryLabel": string (human readable title, e.g. "Bank Account Name Mismatch"),
  "severity": "blocker" | "warning" | "informational",
  "confidence": "high" | "medium" | "low",
  "plainLanguageExplanation": string (2-3 concise, compassionate, jargon-free sentences explaining what happened),
  "rootCause": string (the exact factual reason for the issue),
  "citedNextSteps": [
    {
      "order": number,
      "step": string (clear actionable task for the person),
      "owner": "Citizen" | "Employer" | "Bank" | "Field Office (EPFO)",
      "officialRuleCitation": string (relevant Indian regulation e.g. "EPF Scheme 1952 Para 68J", "EPFO Joint Declaration SOP 2023", "RBI KYC Master Direction")
    }
  ],
  "suggestedGrievanceNote": string (optional respectful draft note for EPFiGMS if field office clarification or appeal is warranted)
}

Strict Rules:
- Never collect or hallucinate private Aadhaar/PAN/password details.
- Always provide clear ownership for each step.
- Do not add markdown formatting around the JSON object.`;

type OpenAiChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

type ParsedStep = {
  order?: number;
  step?: string;
  owner?: "Citizen" | "Employer" | "Bank" | "Field Office (EPFO)";
  officialRuleCitation?: string;
};

type ParsedAiPayload = {
  category?: ClaimIssueCategory;
  categoryLabel?: string;
  severity?: "blocker" | "warning" | "informational";
  confidence?: "high" | "medium" | "low";
  plainLanguageExplanation?: string;
  rootCause?: string;
  citedNextSteps?: ParsedStep[];
  suggestedGrievanceNote?: string;
};

export async function interpretClaimIssue(
  request: InterpretationRequest,
): Promise<ClaimIssueInterpretation> {
  const rawText = request.rawStatusText?.trim();
  if (!rawText) {
    return interpretWithRuleFallback({ rawStatusText: "No status provided" });
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  if (!apiKey) {
    return interpretWithRuleFallback(request);
  }

  try {
    const contextPrompt = request.context
      ? `\nContext: Persona=${request.context.personaId ?? "none"}, ClaimType=${request.context.claimType ?? "PF Advance"}, Requested=₹${request.context.requestedAmountRupees ?? 0}, Settled=₹${request.context.settledAmountRupees ?? 0}`
      : "";

    const userPrompt = `Please interpret this EPFO claim remark: "${rawText}"${contextPrompt}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      return interpretWithRuleFallback(request);
    }

    const data = (await response.json()) as OpenAiChatResponse | null;
    const candidateJson = data?.choices?.[0]?.message?.content;
    if (typeof candidateJson !== "string") {
      return interpretWithRuleFallback(request);
    }

    const parsed = JSON.parse(candidateJson) as ParsedAiPayload | null;
    if (!parsed || typeof parsed !== "object") {
      return interpretWithRuleFallback(request);
    }

    if (
      typeof parsed.category !== "string" ||
      typeof parsed.categoryLabel !== "string" ||
      typeof parsed.plainLanguageExplanation !== "string" ||
      !Array.isArray(parsed.citedNextSteps)
    ) {
      return interpretWithRuleFallback(request);
    }

    return {
      version: INTERPRETER_VERSION,
      rawStatusText: rawText,
      category: parsed.category ?? "other",
      categoryLabel: parsed.categoryLabel,
      severity: parsed.severity ?? "blocker",
      confidence: parsed.confidence ?? "high",
      plainLanguageExplanation: parsed.plainLanguageExplanation,
      rootCause: parsed.rootCause ?? "Identified by AI diagnostic engine.",
      citedNextSteps: parsed.citedNextSteps.map((s, idx) => ({
        order: typeof s.order === "number" ? s.order : idx + 1,
        step: String(s.step ?? ""),
        owner: s.owner ?? "Citizen",
        officialRuleCitation:
          s.officialRuleCitation ?? "EPF Scheme 1952 / EPFO Guidelines",
      })),
      suggestedGrievanceNote: parsed.suggestedGrievanceNote,
      modelUsed: model,
      isFallback: false,
      synthetic: true,
    };
  } catch {
    return interpretWithRuleFallback(request);
  }
}
