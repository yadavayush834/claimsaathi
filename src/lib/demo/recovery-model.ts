import type {
  ActionOwner,
  ClaimIssueCategory,
} from "@/lib/ai/interpreter-model";
import type { DemoPersonaId } from "@/lib/demo/model";

export const RECOVERY_STORAGE_KEY = "claimsaathi.rejection-recovery.v1";
export const RECOVERY_VERSION = 1 as const;

export type RecoveryStepId =
  | "verify-bank-passbook"
  | "upload-bank-kyc"
  | "employer-dsc-approval"
  | "preflight-clearance";

export type RejectionRecoveryStep = Readonly<{
  id: RecoveryStepId;
  title: string;
  description: string;
  owner: ActionOwner;
  completed: boolean;
  officialCitation: string;
}>;

export type RejectionRecoveryPlan = Readonly<{
  version: typeof RECOVERY_VERSION;
  personaId: DemoPersonaId;
  rejectionReason: string;
  category: ClaimIssueCategory;
  categoryLabel: string;
  plainLanguageExplanation: string;
  steps: readonly RejectionRecoveryStep[];
  preflightPassed: boolean;
  resubmitted: boolean;
  resubmittedClaimId?: string;
  lastUpdated: string;
  synthetic: true;
}>;
