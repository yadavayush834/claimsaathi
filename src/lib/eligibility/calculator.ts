import {
  ELIGIBILITY_POLICY_VERSION,
  getPurposePolicy,
  MINIMUM_SERVICE_MONTHS,
  PROTECTED_BALANCE_PERCENT,
  type WithdrawalPurpose,
} from "./policy";

export type EligibilityInput = Readonly<{
  purpose: WithdrawalPurpose;
  totalServiceMonths: number;
  previousWithdrawals: number;
  amountNeededRupees: number;
  employeeShareRupees: number;
  employerShareRupees: number;
  pensionShareRupees: number;
}>;

export type EligibilityCheck = Readonly<{
  id: "service" | "frequency" | "amount";
  passed: boolean;
  label: string;
  explanation: string;
}>;

export type EligibilityResult = Readonly<{
  policyVersion: typeof ELIGIBILITY_POLICY_VERSION;
  eligible: boolean;
  purposeLabel: string;
  checks: readonly EligibilityCheck[];
  amounts: Readonly<{
    contributionBalanceRupees: number;
    pensionExcludedRupees: number;
    protectedBalanceRupees: number;
    policyMaximumRupees: number;
    amountNeededRupees: number;
    eligibleAmountRupees: number;
    contributionBalanceAfterRupees: number;
  }>;
  limitingRule: string;
}>;

function asWholeNonNegative(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

export function calculateMockEligibility(
  input: EligibilityInput,
): EligibilityResult {
  const purposePolicy = getPurposePolicy(input.purpose);
  const serviceMonths = asWholeNonNegative(input.totalServiceMonths);
  const previousWithdrawals = asWholeNonNegative(input.previousWithdrawals);
  const amountNeeded = asWholeNonNegative(input.amountNeededRupees);
  const employeeShare = asWholeNonNegative(input.employeeShareRupees);
  const employerShare = asWholeNonNegative(input.employerShareRupees);
  const pensionShare = asWholeNonNegative(input.pensionShareRupees);
  const contributionBalance = employeeShare + employerShare;
  const protectedBalance = Math.ceil(
    contributionBalance * (PROTECTED_BALANCE_PERCENT / 100),
  );
  const policyMaximum = Math.max(0, contributionBalance - protectedBalance);

  const servicePassed = serviceMonths >= MINIMUM_SERVICE_MONTHS;
  const frequencyPassed = previousWithdrawals < purposePolicy.frequencyLimit;
  const amountPassed = amountNeeded > 0 && policyMaximum > 0;
  const eligible = servicePassed && frequencyPassed && amountPassed;
  const eligibleAmount = eligible ? Math.min(amountNeeded, policyMaximum) : 0;

  const checks: readonly EligibilityCheck[] = [
    {
      id: "service",
      passed: servicePassed,
      label: "Minimum service",
      explanation: servicePassed
        ? `${serviceMonths} months entered; the demo minimum is ${MINIMUM_SERVICE_MONTHS} months.`
        : `${serviceMonths} months entered; this demo requires at least ${MINIMUM_SERVICE_MONTHS} months.`,
    },
    {
      id: "frequency",
      passed: frequencyPassed,
      label: "Previous withdrawals",
      explanation: `${previousWithdrawals} of ${purposePolicy.frequencyLimit} used ${purposePolicy.frequencyWindow}.`,
    },
    {
      id: "amount",
      passed: amountPassed,
      label: "Balance available",
      explanation:
        "The demo considers employee and employer shares, then protects 25%; the pension share is excluded.",
    },
  ];

  let limitingRule = "The amount entered is within the mock policy maximum.";

  if (!servicePassed) {
    limitingRule = "Minimum service is the first unmet rule.";
  } else if (!frequencyPassed) {
    limitingRule = "The purpose-specific withdrawal frequency is exhausted.";
  } else if (!amountPassed) {
    limitingRule =
      "A positive need and available contribution balance are required.";
  } else if (amountNeeded > policyMaximum) {
    limitingRule =
      "The mock policy maximum is lower than the amount entered, so the result is capped.";
  }

  return {
    policyVersion: ELIGIBILITY_POLICY_VERSION,
    eligible,
    purposeLabel: purposePolicy.label,
    checks,
    amounts: {
      contributionBalanceRupees: contributionBalance,
      pensionExcludedRupees: pensionShare,
      protectedBalanceRupees: protectedBalance,
      policyMaximumRupees: policyMaximum,
      amountNeededRupees: amountNeeded,
      eligibleAmountRupees: eligibleAmount,
      contributionBalanceAfterRupees: contributionBalance - eligibleAmount,
    },
    limitingRule,
  };
}
