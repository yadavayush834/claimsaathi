export const ELIGIBILITY_POLICY_VERSION = "epfo-cbt-2025-10" as const;
export const ELIGIBILITY_POLICY_SOURCE_URL =
  "https://www.epfindia.gov.in/site_docs/PDFs/EPFO_PRESS_RELEASES/PressBrief_MOL%26EChairs238thMeetingCBT_EPF_13102025.pdf";

export const MINIMUM_SERVICE_MONTHS = 12;
export const PROTECTED_BALANCE_PERCENT = 25;

export const WITHDRAWAL_PURPOSES = [
  {
    id: "medical",
    label: "Medical treatment",
    description:
      "For a fictional illness or treatment need for self or family.",
    frequencyLimit: 3,
    frequencyWindow: "in the current financial year",
  },
  {
    id: "education",
    label: "Education",
    description: "For a fictional education expense for self or family.",
    frequencyLimit: 10,
    frequencyWindow: "during membership",
  },
  {
    id: "marriage",
    label: "Marriage",
    description: "For a fictional marriage expense for self or family.",
    frequencyLimit: 5,
    frequencyWindow: "during membership",
  },
  {
    id: "housing",
    label: "Housing",
    description:
      "For a fictional purchase, construction, loan, or renovation need.",
    frequencyLimit: 5,
    frequencyWindow: "during membership",
  },
] as const;

export type WithdrawalPurpose = (typeof WITHDRAWAL_PURPOSES)[number]["id"];
export type WithdrawalPurposePolicy = (typeof WITHDRAWAL_PURPOSES)[number];

export function getPurposePolicy(
  purpose: WithdrawalPurpose,
): WithdrawalPurposePolicy {
  const policy = WITHDRAWAL_PURPOSES.find((item) => item.id === purpose);

  if (!policy) {
    throw new Error(`Unknown withdrawal purpose: ${purpose}`);
  }

  return policy;
}
