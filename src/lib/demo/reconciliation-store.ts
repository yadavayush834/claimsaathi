import type { DemoPersonaId } from "./model";
import {
  getReconciliationStorageKey,
  type SettlementReconciliationReport,
  validateSettlementReconciliation,
} from "./reconciliation-model";

type SafeStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type SettlementReconciliationStore = Readonly<{
  load: (personaId: DemoPersonaId) => SettlementReconciliationReport | null;
  save: (report: SettlementReconciliationReport) => boolean;
  clear: (personaId: DemoPersonaId) => void;
}>;

export function createReconciliationStore(
  storage?: SafeStorage,
): SettlementReconciliationStore {
  return {
    load(personaId: DemoPersonaId): SettlementReconciliationReport | null {
      if (!storage) return null;
      try {
        const raw = storage.getItem(getReconciliationStorageKey(personaId));
        if (!raw) return null;
        return validateSettlementReconciliation(JSON.parse(raw));
      } catch {
        return null;
      }
    },

    save(report: SettlementReconciliationReport): boolean {
      if (!storage) return false;
      try {
        storage.setItem(
          getReconciliationStorageKey(report.personaId),
          JSON.stringify(report),
        );
        return true;
      } catch {
        return false;
      }
    },

    clear(personaId: DemoPersonaId): void {
      if (!storage) return;
      try {
        storage.removeItem(getReconciliationStorageKey(personaId));
      } catch {
        // Ignore storage removal errors
      }
    },
  };
}
