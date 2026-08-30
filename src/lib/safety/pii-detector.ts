/**
 * Sensitive PII and credential detection utility for ClaimSaathi.
 *
 * Scans citizen inputs to prevent accidental leakage or entry of real
 * Aadhaar numbers, Permanent Account Numbers (PAN), Universal Account
 * Numbers (UAN), Bank Account / IFSC codes, and passwords.
 */

export interface PiiDetectionResult {
  hasPii: boolean;
  detectedTypes: Array<
    "aadhaar" | "pan" | "uan" | "bank_account" | "ifsc" | "secret"
  >;
  warningEn: string | null;
  warningHi: string | null;
}

// Regex patterns for Indian identity numbers & financial data
const AADHAAR_REGEX = /\b[2-9]\d{3}\s?\d{4}\s?\d{4}\b/;
const PAN_REGEX = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/i;
const UAN_REGEX = /\b10\d{10}\b/;
const IFSC_REGEX = /\b[A-Z]{4}0[A-Z0-9]{6}\b/i;
const BANK_ACC_REGEX = /\b\d{11,18}\b/;
const SECRET_REGEX =
  /\b(password|passwd|pin\s*:\s*\d{4,6}|otp\s*:\s*\d{4,8})\b/i;

// Allow-listed synthetic / demo numbers to avoid false positives on sample test cases
const ALLOWED_DEMO_STRINGS = new Set([
  "100904123456",
  "101234567890",
  "101876543210",
  "ABCDE1234F",
  "DEMO-CLM-1001",
  "DEMO-CLM-1002",
  "DEMO-CLM-1003",
  "DEMO-CLM-1004",
  "SBIN0001234",
  "HDFC0000456",
  "ICIC0000789",
  "123456", // default mock OTP
]);

export function detectSensitivePii(input: string): PiiDetectionResult {
  if (!input || typeof input !== "string") {
    return {
      hasPii: false,
      detectedTypes: [],
      warningEn: null,
      warningHi: null,
    };
  }

  const detectedTypes: PiiDetectionResult["detectedTypes"] = [];

  // Check if string is explicitly an allowlisted synthetic fixture
  const trimmed = input.trim();
  if (ALLOWED_DEMO_STRINGS.has(trimmed)) {
    return {
      hasPii: false,
      detectedTypes: [],
      warningEn: null,
      warningHi: null,
    };
  }

  if (SECRET_REGEX.test(input)) {
    detectedTypes.push("secret");
  }

  if (
    PAN_REGEX.test(input) &&
    !ALLOWED_DEMO_STRINGS.has(trimmed.toUpperCase())
  ) {
    detectedTypes.push("pan");
  }

  if (AADHAAR_REGEX.test(input)) {
    detectedTypes.push("aadhaar");
  }

  if (UAN_REGEX.test(input) && !ALLOWED_DEMO_STRINGS.has(trimmed)) {
    detectedTypes.push("uan");
  }

  if (
    IFSC_REGEX.test(input) &&
    !ALLOWED_DEMO_STRINGS.has(trimmed.toUpperCase())
  ) {
    detectedTypes.push("ifsc");
  }

  if (
    BANK_ACC_REGEX.test(input) &&
    !detectedTypes.includes("uan") &&
    !detectedTypes.includes("aadhaar")
  ) {
    detectedTypes.push("bank_account");
  }

  const hasPii = detectedTypes.length > 0;

  if (!hasPii) {
    return {
      hasPii: false,
      detectedTypes: [],
      warningEn: null,
      warningHi: null,
    };
  }

  const typeLabels = detectedTypes.join(", ");
  const warningEn = `⚠️ Privacy Warning: Potential sensitive details (${typeLabels}) detected. ClaimSaathi is an independent educational prototype—never enter real government identifiers, real bank details, or real credentials.`;
  const warningHi = `⚠️ गोपनीयता चेतावनी: संभावित संवेदनशील विवरण (${typeLabels}) पाए गए। क्लेमसाथी केवल एक शैक्षिक प्रोटोटाइप है—कृपया वास्तविक आधार, पैन, यूएएन या बैंक खाते का उपयोग न करें।`;

  return {
    hasPii: true,
    detectedTypes,
    warningEn,
    warningHi,
  };
}
