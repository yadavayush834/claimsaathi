import type { DemoPersonaId } from "./model";
import {
  RECONCILIATION_VERSION,
  type ReconciliationResolutionStatus,
  type SettlementConfirmedFact,
  type SettlementDeductionItem,
  type SettlementReconciliationReport,
} from "./reconciliation-model";
import { createReconciliationStore } from "./reconciliation-store";

function getStorage(): Storage | undefined {
  if (typeof window === "undefined") return undefined;
  return window.localStorage;
}

const LATHA_CONFIRMED_FACTS: readonly SettlementConfirmedFact[] = [
  {
    id: "fact-requested-amount",
    label: "Requested Advance Amount",
    value: "₹1,10,000",
    source: "Member Application",
    verified: true,
  },
  {
    id: "fact-member-balance",
    label: "Employee Share Balance on Record",
    value: "₹1,82,500",
    source: "EPFO Passbook Record",
    verified: true,
  },
  {
    id: "fact-monthly-wage",
    label: "Basic Wage + DA Ceiling (24 Months)",
    value: "₹92,000 (₹3,833.33/mo base)",
    source: "EPFO Passbook Record",
    verified: true,
  },
  {
    id: "fact-disbursed-amount",
    label: "EPFO Disbursed Settlement",
    value: "₹92,000",
    source: "EPFO Dispatch Advice",
    verified: true,
  },
  {
    id: "fact-bank-credit",
    label: "Credited Bank Account",
    value: "State Bank of India (•••• 5129)",
    source: "Bank Credit Statement",
    verified: true,
  },
];

const LATHA_DEDUCTIONS_AND_FACTORS: readonly SettlementDeductionItem[] = [
  {
    id: "deduction-statutory-wage-cap",
    title: "Statutory 24-Month Wage Ceiling Cap",
    amountRupees: 18000,
    ruleCitation: "EPF Scheme 1952 Para 68B(2)",
    type: "statutory_cap",
    isExplained: true,
    explanation:
      "Under EPFO Para 68B rules for construction/alteration, the maximum permissible non-refundable advance is strictly capped at 24 times monthly basic wage + DA, even though member employee balance was sufficient for ₹1,10,000.",
  },
  {
    id: "factor-service-eligibility",
    title: "Continuous Service Duration Requirement",
    amountRupees: 0,
    ruleCitation: "EPF Scheme 1952 Para 68B(1)",
    type: "service_duration_capping",
    isExplained: true,
    explanation:
      "Member has 7.5 years of continuous contributory service, satisfying the 5-year prerequisite without penalty or TDS under Section 192A.",
  },
];

export function buildBaselineReconciliationReport(
  personaId: DemoPersonaId,
): SettlementReconciliationReport {
  if (personaId === "latha-settlement") {
    return {
      version: RECONCILIATION_VERSION,
      personaId: "latha-settlement",
      claimId: "DEMO-CLM-1003",
      claimType: "Form 31 (PF Advance - House Construction / Alteration)",
      requestedAmountRupees: 110000,
      eligibleAmountRupees: 92000,
      settledAmountRupees: 92000,
      varianceRupees: 18000,
      disbursementDate: "2026-08-27",
      disbursedBankMasked: "SBI •••• 5129",
      confirmedFacts: LATHA_CONFIRMED_FACTS,
      deductionsAndFactors: LATHA_DEDUCTIONS_AND_FACTORS,
      unexplainedShortfallRupees: 0,
      resolutionStatus: "under_review",
      updatedAt: "2026-08-27T14:30:00.000Z",
    };
  }

  // Fallback baseline for other synthetic personas
  return {
    version: RECONCILIATION_VERSION,
    personaId,
    claimId: "DEMO-CLM-GENERIC",
    claimType: "Form 31 (PF Advance)",
    requestedAmountRupees: 75000,
    eligibleAmountRupees: 75000,
    settledAmountRupees: 75000,
    varianceRupees: 0,
    disbursementDate: "2026-08-28",
    disbursedBankMasked: "Verified Bank Account",
    confirmedFacts: [],
    deductionsAndFactors: [],
    unexplainedShortfallRupees: 0,
    resolutionStatus: "under_review",
    updatedAt: "2026-08-28T10:00:00.000Z",
  };
}

export const reconciliationService = {
  getReconciliationReport(
    personaId: DemoPersonaId,
  ): SettlementReconciliationReport {
    const store = createReconciliationStore(getStorage());
    const existing = store.load(personaId);
    if (existing) {
      return existing;
    }

    const baseline = buildBaselineReconciliationReport(personaId);
    store.save(baseline);
    return baseline;
  },

  updateResolutionStatus(
    personaId: DemoPersonaId,
    status: ReconciliationResolutionStatus,
  ): SettlementReconciliationReport {
    const current = this.getReconciliationReport(personaId);
    const updated: SettlementReconciliationReport = {
      ...current,
      resolutionStatus: status,
      updatedAt: new Date().toISOString(),
    };

    const store = createReconciliationStore(getStorage());
    store.save(updated);
    return updated;
  },

  resetReconciliation(
    personaId: DemoPersonaId,
  ): SettlementReconciliationReport {
    const store = createReconciliationStore(getStorage());
    store.clear(personaId);
    return this.getReconciliationReport(personaId);
  },
};
