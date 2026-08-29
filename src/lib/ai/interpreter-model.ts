import type { DemoPersonaId } from "@/lib/demo/model";

export const INTERPRETER_VERSION = 1 as const;

export type ClaimIssueCategory =
  | "kyc_mismatch"
  | "bank_error"
  | "service_eligibility"
  | "missing_evidence"
  | "duplicate_claim"
  | "unexplained_rejection"
  | "settlement_difference"
  | "other";

export type ClaimIssueSeverity = "blocker" | "warning" | "informational";

export type InterpretationConfidence = "high" | "medium" | "low";

export type ActionOwner =
  "Citizen" | "Employer" | "Bank" | "Field Office (EPFO)";

export type InterpretationCitedStep = Readonly<{
  order: number;
  step: string;
  owner: ActionOwner;
  officialRuleCitation: string;
}>;

export type ClaimIssueInterpretation = Readonly<{
  version: typeof INTERPRETER_VERSION;
  rawStatusText: string;
  category: ClaimIssueCategory;
  categoryLabel: string;
  severity: ClaimIssueSeverity;
  confidence: InterpretationConfidence;
  plainLanguageExplanation: string;
  rootCause: string;
  citedNextSteps: readonly InterpretationCitedStep[];
  suggestedGrievanceNote?: string;
  modelUsed: string;
  isFallback: boolean;
  synthetic: true;
}>;

export type InterpretationRequest = Readonly<{
  rawStatusText: string;
  context?: {
    personaId?: DemoPersonaId;
    claimType?: string;
    requestedAmountRupees?: number;
    settledAmountRupees?: number;
  };
}>;

export type InterpretationResponse =
  | Readonly<{
      ok: true;
      interpretation: ClaimIssueInterpretation;
    }>
  | Readonly<{
      ok: false;
      error: string;
    }>;
