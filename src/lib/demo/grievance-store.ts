import { DemoPersonaId } from "./model";
import {
  DemoGrievanceRecord,
  getGrievanceStorageKey,
  validateGrievanceRecord,
} from "./grievance-model";

export const grievanceStore = {
  load(personaId: DemoPersonaId): DemoGrievanceRecord | null {
    if (typeof window === "undefined" || !window.localStorage) {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(
        getGrievanceStorageKey(personaId),
      );
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      return validateGrievanceRecord(parsed);
    } catch {
      return null;
    }
  },

  save(record: DemoGrievanceRecord): void {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.setItem(
        getGrievanceStorageKey(record.personaId),
        JSON.stringify(record),
      );
    } catch {
      // Ignore storage quota or disabled exceptions in sandbox
    }
  },

  clear(personaId: DemoPersonaId): void {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.removeItem(getGrievanceStorageKey(personaId));
    } catch {
      // Ignore
    }
  },
};
