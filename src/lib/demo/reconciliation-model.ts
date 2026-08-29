import type { DemoPersonaId } from "./model";

export const RECONCILIATION_STORAGE_KEY_PREFIX =
  "claimsaathi.settlement-reconciliation.v1";
export const RECONCILIATION_VERSION = 1;

export type SettlementFactSource =
  | "Member Application"
  | "EPFO Passbook Record"
  | "EPFO Dispatch Advice"
  | "Bank Credit Statement";

export type SettlementConfirmedFact = Readonly<{
  id: string;
  label: string;
  value: string;
  source: SettlementFactSource;
  verified: boolean;
}>;

export type DeductionType =
  | "statutory_cap"
  | "tds_deduction"
  | "unexplained_shortfall"
  | "service_duration_capping";

export type SettlementDeductionItem = Readonly<{
  id: string;
  title: string;
  amountRupees: number;
  ruleCitation: string;
  type: DeductionType;
  isExplained: boolean;
  explanation: string;
}>;

export type ReconciliationResolutionStatus =
  "under_review" | "accepted_statutory" | "disputed_for_grievance";

export type SettlementReconciliationReport = Readonly<{
  version: number;
  personaId: DemoPersonaId;
  claimId: string;
  claimType: string;
  requestedAmountRupees: number;
  eligibleAmountRupees: number;
  settledAmountRupees: number;
  varianceRupees: number;
  disbursementDate: string;
  disbursedBankMasked: string;
  confirmedFacts: readonly SettlementConfirmedFact[];
  deductionsAndFactors: readonly SettlementDeductionItem[];
  unexplainedShortfallRupees: number;
  resolutionStatus: ReconciliationResolutionStatus;
  updatedAt: string;
}>;

export function getReconciliationStorageKey(personaId: DemoPersonaId): string {
  return `${RECONCILIATION_STORAGE_KEY_PREFIX}:${personaId}`;
}

export function validateSettlementReconciliation(
  raw: unknown,
): SettlementReconciliationReport | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Record<string, unknown>;

  if (
    typeof data.version !== "number" ||
    data.version !== RECONCILIATION_VERSION ||
    typeof data.personaId !== "string" ||
    typeof data.claimId !== "string" ||
    typeof data.claimType !== "string" ||
    typeof data.requestedAmountRupees !== "number" ||
    typeof data.eligibleAmountRupees !== "number" ||
    typeof data.settledAmountRupees !== "number" ||
    typeof data.varianceRupees !== "number" ||
    typeof data.disbursementDate !== "string" ||
    typeof data.disbursedBankMasked !== "string" ||
    !Array.isArray(data.confirmedFacts) ||
    !Array.isArray(data.deductionsAndFactors) ||
    typeof data.unexplainedShortfallRupees !== "number" ||
    typeof data.resolutionStatus !== "string" ||
    typeof data.updatedAt !== "string"
  ) {
    return null;
  }

  const validStatuses: readonly ReconciliationResolutionStatus[] = [
    "under_review",
    "accepted_statutory",
    "disputed_for_grievance",
  ];
  if (
    !validStatuses.includes(
      data.resolutionStatus as ReconciliationResolutionStatus,
    )
  ) {
    return null;
  }

  for (const fact of data.confirmedFacts) {
    if (
      !fact ||
      typeof fact !== "object" ||
      typeof fact.id !== "string" ||
      typeof fact.label !== "string" ||
      typeof fact.value !== "string" ||
      typeof fact.source !== "string" ||
      typeof fact.verified !== "boolean"
    ) {
      return null;
    }
  }

  for (const item of data.deductionsAndFactors) {
    if (
      !item ||
      typeof item !== "object" ||
      typeof item.id !== "string" ||
      typeof item.title !== "string" ||
      typeof item.amountRupees !== "number" ||
      typeof item.ruleCitation !== "string" ||
      typeof item.type !== "string" ||
      typeof item.isExplained !== "boolean" ||
      typeof item.explanation !== "string"
    ) {
      return null;
    }
  }

  return {
    version: data.version,
    personaId: data.personaId as DemoPersonaId,
    claimId: data.claimId,
    claimType: data.claimType,
    requestedAmountRupees: data.requestedAmountRupees,
    eligibleAmountRupees: data.eligibleAmountRupees,
    settledAmountRupees: data.settledAmountRupees,
    varianceRupees: data.varianceRupees,
    disbursementDate: data.disbursementDate,
    disbursedBankMasked: data.disbursedBankMasked,
    confirmedFacts: data.confirmedFacts as readonly SettlementConfirmedFact[],
    deductionsAndFactors:
      data.deductionsAndFactors as readonly SettlementDeductionItem[],
    unexplainedShortfallRupees: data.unexplainedShortfallRupees,
    resolutionStatus: data.resolutionStatus as ReconciliationResolutionStatus,
    updatedAt: data.updatedAt,
  };
}
