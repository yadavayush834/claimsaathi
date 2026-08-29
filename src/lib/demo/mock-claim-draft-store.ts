import {
  DEMO_DATA_VERSION,
  isDemoPersonaId,
  type DemoPersonaId,
  type MockClaimDraft,
} from "@/lib/demo/model";

export const MOCK_CLAIM_DRAFT_STORAGE_KEY = "claimsaathi.mock-claim-draft.v1";

type SessionStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export interface MockClaimDraftStore {
  load(personaId: DemoPersonaId): MockClaimDraft | null;
  save(draft: MockClaimDraft): boolean;
  clear(personaId: DemoPersonaId): boolean;
}

function isMockClaimFormStep(value: unknown): value is MockClaimDraft["step"] {
  return value === 1 || value === 2 || value === 3 || value === 4;
}

function isNotificationRoute(
  value: unknown,
): value is MockClaimDraft["notificationRoute"] {
  return value === "browser" || value === "mock_sms" || value === "mock_email";
}

function isMockClaimDraft(value: unknown): value is MockClaimDraft {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<MockClaimDraft>;
  return (
    candidate.version === DEMO_DATA_VERSION &&
    isDemoPersonaId(candidate.personaId) &&
    isMockClaimFormStep(candidate.step) &&
    typeof candidate.treatmentNeed === "string" &&
    typeof candidate.fictionalCity === "string" &&
    isNotificationRoute(candidate.notificationRoute) &&
    typeof candidate.bankConfirmed === "boolean" &&
    typeof candidate.declarationConfirmed === "boolean" &&
    (candidate.consentConfirmed === undefined ||
      typeof candidate.consentConfirmed === "boolean") &&
    (candidate.simulatedOtp === undefined ||
      typeof candidate.simulatedOtp === "string")
  );
}

export function createMockClaimDraftStore(
  storage: SessionStorage,
): MockClaimDraftStore {
  return {
    load(personaId) {
      try {
        const serialized = storage.getItem(MOCK_CLAIM_DRAFT_STORAGE_KEY);

        if (!serialized) {
          return null;
        }

        const parsed: unknown = JSON.parse(serialized);

        if (!isMockClaimDraft(parsed) || parsed.personaId !== personaId) {
          return null;
        }

        return parsed;
      } catch {
        return null;
      }
    },
    save(draft) {
      try {
        storage.setItem(MOCK_CLAIM_DRAFT_STORAGE_KEY, JSON.stringify(draft));
        return true;
      } catch {
        return false;
      }
    },
    clear(personaId) {
      try {
        const stored = this.load(personaId);

        if (stored) {
          storage.removeItem(MOCK_CLAIM_DRAFT_STORAGE_KEY);
        }

        return true;
      } catch {
        return false;
      }
    },
  };
}
