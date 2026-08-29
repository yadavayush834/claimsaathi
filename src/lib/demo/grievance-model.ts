import { DemoPersonaId } from "./model";

export type GrievanceCategory =
  | "amount_discrepancy"
  | "unreasonable_rejection"
  | "processing_delay"
  | "kyc_approval_delay";

export interface GrievanceEvidenceItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly required: boolean;
  readonly attached: boolean;
  readonly fileName?: string;
}

export interface GrievanceEvent {
  readonly id: string;
  readonly date: string;
  readonly title: string;
  readonly description: string;
  readonly by: string;
}

export type GrievanceStatus =
  "draft" | "registered" | "under_review" | "resolved";

export interface DemoGrievanceRecord {
  readonly schemaVersion: "claimsaathi.grievance.v1";
  readonly personaId: DemoPersonaId;
  readonly claimId: string;
  readonly category: GrievanceCategory;
  readonly subject: string;
  readonly petitionText: string;
  readonly evidenceList: readonly GrievanceEvidenceItem[];
  readonly status: GrievanceStatus;
  readonly registrationNumber?: string;
  readonly registeredAt?: string;
  readonly slaDaysRemaining: number;
  readonly reminderActive: boolean;
  readonly events: readonly GrievanceEvent[];
}

export const GRIEVANCE_STORAGE_KEY_PREFIX = "claimsaathi.demo.grievance.v1";

export function getGrievanceStorageKey(personaId: DemoPersonaId): string {
  return `${GRIEVANCE_STORAGE_KEY_PREFIX}.${personaId}`;
}

export function isGrievanceRecord(
  value: unknown,
): value is DemoGrievanceRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  if (candidate.schemaVersion !== "claimsaathi.grievance.v1") {
    return false;
  }

  if (
    typeof candidate.personaId !== "string" ||
    typeof candidate.claimId !== "string" ||
    typeof candidate.category !== "string" ||
    typeof candidate.subject !== "string" ||
    typeof candidate.petitionText !== "string" ||
    !Array.isArray(candidate.evidenceList) ||
    typeof candidate.status !== "string" ||
    typeof candidate.slaDaysRemaining !== "number" ||
    typeof candidate.reminderActive !== "boolean" ||
    !Array.isArray(candidate.events)
  ) {
    return false;
  }

  return true;
}

export function validateGrievanceRecord(
  value: unknown,
): DemoGrievanceRecord | null {
  return isGrievanceRecord(value) ? value : null;
}
