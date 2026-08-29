import {
  INTERPRETER_VERSION,
  type ClaimIssueCategory,
  type ClaimIssueInterpretation,
  type ClaimIssueSeverity,
  type InterpretationCitedStep,
  type InterpretationConfidence,
  type InterpretationRequest,
} from "./interpreter-model";

type KnownRulePattern = Readonly<{
  match: RegExp;
  category: ClaimIssueCategory;
  categoryLabel: string;
  severity: ClaimIssueSeverity;
  confidence: InterpretationConfidence;
  plainLanguageExplanation: string;
  rootCause: string;
  citedNextSteps: readonly InterpretationCitedStep[];
  suggestedGrievanceNote?: string;
}>;

const knownPatterns: readonly KnownRulePattern[] = [
  {
    match:
      /name.*bank.*(?:not.*match|mismatch|differ|differs)|bank.*name.*(?:not.*match|mismatch|differ|differs)|name.*in.*bank|bank.*kyc.*(?:not.*match|mismatch|differ)|bank.*kyc/i,
    category: "bank_error",
    categoryLabel: "Bank Account Name Mismatch",
    severity: "blocker",
    confidence: "high",
    plainLanguageExplanation:
      "Your claim was halted because the spelling of your name in your bank's records differs from your EPFO member record. Banks reject government NEFT transfers when beneficiary names do not match exactly.",
    rootCause:
      "Mismatch between bank account title and EPFO Universal Account Number (UAN) record.",
    citedNextSteps: [
      {
        order: 1,
        step: "Check your bank passbook/statement to see the exact recorded name spelling (including initials).",
        owner: "Citizen",
        officialRuleCitation: "EPFO Circular No. WSU/2022/Bank-KYC/12",
      },
      {
        order: 2,
        step: "If bank has an abbreviated name, request your bank branch to update the record or link another active bank account in your full name.",
        owner: "Bank",
        officialRuleCitation: "RBI Master Direction on Customer KYC 2016",
      },
      {
        order: 3,
        step: "Upload the verified bank account KYC on the Unified Member Portal and obtain digital approval from your employer.",
        owner: "Employer",
        officialRuleCitation: "EPF Scheme 1952 Para 72(5)",
      },
    ],
    suggestedGrievanceNote:
      "Respected Field Office, my bank account name was updated to match my EPFO UAN record. Please approve the re-submitted claim.",
  },
  {
    match:
      /date of birth.*mismatch|dob.*mismatch|joint declaration.*dob|age.*differs/i,
    category: "kyc_mismatch",
    categoryLabel: "Date of Birth Discrepancy",
    severity: "blocker",
    confidence: "high",
    plainLanguageExplanation:
      "The date of birth recorded in your EPFO profile differs from your Aadhaar or identity document by more than what standard portal self-correction permits.",
    rootCause:
      "Difference in recorded date of birth between Aadhaar database and EPFO master record.",
    citedNextSteps: [
      {
        order: 1,
        step: "Compare your Aadhaar birth date with the date shown on your UAN Member Profile.",
        owner: "Citizen",
        officialRuleCitation: "EPFO Joint Declaration SOP Circular Dec 2023",
      },
      {
        order: 2,
        step: "Initiate an Online Joint Declaration request on Member Portal attaching Aadhaar, Passport, or Birth Certificate proof.",
        owner: "Citizen",
        officialRuleCitation: "Joint Declaration Standard Operating Procedure",
      },
      {
        order: 3,
        step: "Employer reviews and digitally signs the joint declaration request with their digital signature (DSC).",
        owner: "Employer",
        officialRuleCitation: "EPF Scheme 1952 Para 26B",
      },
    ],
    suggestedGrievanceNote:
      "Respected APFC, an Online Joint Declaration with supporting Aadhaar verification has been submitted to correct the birth date.",
  },
  {
    match:
      /medical.*certificate|para 68j|treatment.*note|hospital.*certificate/i,
    category: "missing_evidence",
    categoryLabel: "Missing or Incomplete Medical Evidence",
    severity: "blocker",
    confidence: "high",
    plainLanguageExplanation:
      "For a medical advance under Para 68J, EPFO rules require a certificate or declaration from a registered doctor or employer confirming the hospitalization/treatment need.",
    rootCause:
      "Lack of attached medical documentation or doctor's prescription required for illness advances.",
    citedNextSteps: [
      {
        order: 1,
        step: "Obtain a treatment certificate signed and stamped by a Registered Medical Practitioner (RMP) or hospital authority.",
        owner: "Citizen",
        officialRuleCitation: "EPF Scheme 1952 Para 68J (Illness Advance)",
      },
      {
        order: 2,
        step: "Verify that the certificate mentions the patient's name (self/dependent) and treatment duration.",
        owner: "Citizen",
        officialRuleCitation: "EPF Scheme 1952 Para 68J(2)",
      },
      {
        order: 3,
        step: "Re-submit the Form 31 application attaching the clear, readable PDF copy of the doctor's certificate.",
        owner: "Citizen",
        officialRuleCitation: "Form 31 Online Guidelines 2024",
      },
    ],
    suggestedGrievanceNote:
      "Respected Authority, the certified medical note in prescribed format is now attached. Kindly process the advance under Para 68J.",
  },
  {
    match:
      /service less than 5 years|less than five years|para 68b|housing.*eligibility/i,
    category: "service_eligibility",
    categoryLabel: "Service Duration Threshold Not Met",
    severity: "blocker",
    confidence: "high",
    plainLanguageExplanation:
      "Certain non-refundable withdrawal types (such as House Construction under Para 68B) require a mandatory minimum continuous service period (5 years).",
    rootCause:
      "Cumulative contributory service in current and previous linked establishments is below the statutory threshold for the selected paragraph.",
    citedNextSteps: [
      {
        order: 1,
        step: "Check if you have previous EPF member accounts from earlier employers that have not been transferred via Form 13 (Annexure K).",
        owner: "Citizen",
        officialRuleCitation: "EPF Scheme 1952 Para 57 (Account Transfer)",
      },
      {
        order: 2,
        step: "If previous service exists, submit an Online Transfer Claim on Member Portal to combine service years.",
        owner: "Citizen",
        officialRuleCitation: "One Member One EPF Account Policy",
      },
      {
        order: 3,
        step: "Alternatively, select an advance category with no minimum service requirement (such as Illness under Para 68J or Natural Calamities under Para 68L).",
        owner: "Citizen",
        officialRuleCitation: "EPF Scheme 1952 Para 68J / 68L",
      },
    ],
  },
  {
    match: /already under process|duplicate claim|prior claim active/i,
    category: "duplicate_claim",
    categoryLabel: "Duplicate Claim Under Active Processing",
    severity: "warning",
    confidence: "high",
    plainLanguageExplanation:
      "An earlier claim submission for this member ID is currently active in the field office queue. The portal does not permit concurrent claims for the same withdrawal type.",
    rootCause:
      "A previously submitted Form 31 or Form 19 has not completed settlement or rejection processing.",
    citedNextSteps: [
      {
        order: 1,
        step: "Track the status of the first active claim in your portal timeline before filing another request.",
        owner: "Citizen",
        officialRuleCitation: "EPFO Citizen Charter 2023",
      },
      {
        order: 2,
        step: "If the earlier claim has been pending over 20 days without progress, register a reminder via EPFiGMS.",
        owner: "Field Office (EPFO)",
        officialRuleCitation: "EPFiGMS Standard Service Timeline",
      },
    ],
  },
  {
    match:
      /settled for rs|settlement.*lower|less than claimed|wage ceiling.*limit/i,
    category: "settlement_difference",
    categoryLabel: "Settlement Amount Variance",
    severity: "informational",
    confidence: "high",
    plainLanguageExplanation:
      "The amount disbursed is lower than the amount you requested because statutory ceilings (such as 6 months basic wage + DA or employee share balance) capped the permissible sanction.",
    rootCause:
      "Application of statutory formula caps under the specific withdrawal paragraph.",
    citedNextSteps: [
      {
        order: 1,
        step: "Review the downloadable settlement statement (Annexure-D) on your Passbook portal to verify the exact calculation formula applied.",
        owner: "Citizen",
        officialRuleCitation: "EPF Passbook Breakdown & Calculation Rules",
      },
      {
        order: 2,
        step: "Confirm that employer contribution share and pension fund shares are kept intact for your retirement accumulation.",
        owner: "Citizen",
        officialRuleCitation: "Employees' Pension Scheme 1995",
      },
    ],
  },
  {
    match:
      /da.*remarks|apfc.*remarks|contact.*ro|contact.*field.*office|rejected as per/i,
    category: "unexplained_rejection",
    categoryLabel: "Cryptic Field Office Remark",
    severity: "blocker",
    confidence: "medium",
    plainLanguageExplanation:
      "Your claim received a generic rejection code from the Dealing Assistant without specifying the exact missing record or document.",
    rootCause:
      "Administrative shorthand or uncatalogued review note entered by the field office clerk.",
    citedNextSteps: [
      {
        order: 1,
        step: "Verify that your Member Profile shows 'KYC Done' with green checks across Aadhaar, PAN, and Bank.",
        owner: "Citizen",
        officialRuleCitation: "EPFO SOP on KYC Verification 2024",
      },
      {
        order: 2,
        step: "File a clarification request on EPFiGMS asking the regional office for the specific paragraph and deficiency reason.",
        owner: "Field Office (EPFO)",
        officialRuleCitation: "EPFiGMS Grievance Redressal Mechanism",
      },
    ],
    suggestedGrievanceNote:
      "Respected Regional PF Commissioner, my claim was rejected with generic remarks. Kindly provide the specific deficiency detail so I can submit the required documentation.",
  },
];

export function interpretWithRuleFallback(
  request: InterpretationRequest,
): ClaimIssueInterpretation {
  const text = request.rawStatusText.trim();

  for (const pattern of knownPatterns) {
    if (pattern.match.test(text)) {
      return {
        version: INTERPRETER_VERSION,
        rawStatusText: text,
        category: pattern.category,
        categoryLabel: pattern.categoryLabel,
        severity: pattern.severity,
        confidence: pattern.confidence,
        plainLanguageExplanation: pattern.plainLanguageExplanation,
        rootCause: pattern.rootCause,
        citedNextSteps: pattern.citedNextSteps,
        suggestedGrievanceNote: pattern.suggestedGrievanceNote,
        modelUsed: "offline-rule-engine-v1",
        isFallback: true,
        synthetic: true,
      };
    }
  }

  // Generic keyword analysis fallback
  const isKyc = /name|dob|birth|father|gender|aadhar|aadhaar/i.test(text);
  const isBank = /bank|ifsc|account|cheque|branch/i.test(text);

  const category: ClaimIssueCategory = isBank
    ? "bank_error"
    : isKyc
      ? "kyc_mismatch"
      : "unexplained_rejection";

  const categoryLabel = isBank
    ? "Bank Account Processing Issue"
    : isKyc
      ? "KYC / Member Record Discrepancy"
      : "General Claim Processing Issue";

  return {
    version: INTERPRETER_VERSION,
    rawStatusText: text,
    category,
    categoryLabel,
    severity: "blocker",
    confidence: "medium",
    plainLanguageExplanation: `Your claim status indicates an issue: "${text}". Our diagnostic suggests checking your member KYC and bank account details on the EPFO Unified Portal before filing a resubmission.`,
    rootCause:
      "The portal status indicates a record mismatch or review deficiency.",
    citedNextSteps: [
      {
        order: 1,
        step: "Log in to the Member Portal and verify your profile details against your official documents.",
        owner: "Citizen",
        officialRuleCitation: "EPFO Member Portal Guidelines",
      },
      {
        order: 2,
        step: "Contact your establishment HR / employer to confirm whether your contribution records are up to date.",
        owner: "Employer",
        officialRuleCitation: "EPF Scheme 1952 Para 38",
      },
      {
        order: 3,
        step: "Re-apply with the corrected records or lodge a query on EPFiGMS if the explanation remains ambiguous.",
        owner: "Citizen",
        officialRuleCitation: "EPFiGMS SOP",
      },
    ],
    suggestedGrievanceNote:
      "Respected Authority, kindly clarify the rejection remark so the correct documentation can be furnished.",
    modelUsed: "offline-rule-engine-v1",
    isFallback: true,
    synthetic: true,
  };
}
