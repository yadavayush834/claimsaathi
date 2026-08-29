import type { DemoPersonaId } from "./model";
import {
  RECOVERY_STORAGE_KEY,
  RECOVERY_VERSION,
  type RejectionRecoveryPlan,
  type RejectionRecoveryStep,
} from "./recovery-model";

type RecoveryStoreMap = Record<string, RejectionRecoveryPlan>;

export interface RejectionRecoveryStore {
  load(personaId: DemoPersonaId): RejectionRecoveryPlan | null;
  save(plan: RejectionRecoveryPlan): boolean;
  clear(personaId?: DemoPersonaId): void;
}

function isValidStep(val: unknown): val is RejectionRecoveryStep {
  if (!val || typeof val !== "object") return false;
  const s = val as Record<string, unknown>;
  return (
    typeof s.id === "string" &&
    typeof s.title === "string" &&
    typeof s.description === "string" &&
    typeof s.owner === "string" &&
    typeof s.completed === "boolean" &&
    typeof s.officialCitation === "string"
  );
}

function isValidPlan(val: unknown): val is RejectionRecoveryPlan {
  if (!val || typeof val !== "object") return false;
  const p = val as Record<string, unknown>;
  return (
    p.version === RECOVERY_VERSION &&
    typeof p.personaId === "string" &&
    typeof p.rejectionReason === "string" &&
    typeof p.category === "string" &&
    typeof p.categoryLabel === "string" &&
    typeof p.plainLanguageExplanation === "string" &&
    Array.isArray(p.steps) &&
    p.steps.every(isValidStep) &&
    typeof p.preflightPassed === "boolean" &&
    typeof p.resubmitted === "boolean" &&
    typeof p.lastUpdated === "string" &&
    p.synthetic === true
  );
}

export function createRecoveryStore(
  storage?: Pick<Storage, "getItem" | "setItem" | "removeItem"> | null,
): RejectionRecoveryStore {
  return {
    load(personaId: DemoPersonaId): RejectionRecoveryPlan | null {
      if (!storage) return null;
      try {
        const raw = storage.getItem(RECOVERY_STORAGE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw) as unknown;
        if (!parsed || typeof parsed !== "object") return null;

        const map = parsed as RecoveryStoreMap;
        const candidate = map[personaId];
        return isValidPlan(candidate) ? candidate : null;
      } catch {
        return null;
      }
    },

    save(plan: RejectionRecoveryPlan): boolean {
      if (!storage) return false;
      try {
        let map: RecoveryStoreMap = {};
        const raw = storage.getItem(RECOVERY_STORAGE_KEY);
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as unknown;
            if (parsed && typeof parsed === "object") {
              map = parsed as RecoveryStoreMap;
            }
          } catch {
            map = {};
          }
        }

        map[plan.personaId] = plan;
        storage.setItem(RECOVERY_STORAGE_KEY, JSON.stringify(map));
        return true;
      } catch {
        return false;
      }
    },

    clear(personaId?: DemoPersonaId): void {
      if (!storage) return;
      try {
        if (!personaId) {
          storage.removeItem(RECOVERY_STORAGE_KEY);
          return;
        }

        const raw = storage.getItem(RECOVERY_STORAGE_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw) as unknown;
        if (parsed && typeof parsed === "object") {
          const map = parsed as RecoveryStoreMap;
          delete map[personaId];
          storage.setItem(RECOVERY_STORAGE_KEY, JSON.stringify(map));
        }
      } catch {
        // Storage clearing ignored
      }
    },
  };
}
