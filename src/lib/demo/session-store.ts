import {
  DEMO_DATA_VERSION,
  isDemoPersonaId,
  type DemoPersonaId,
  type DemoSession,
} from "@/lib/demo/model";

export const DEMO_SESSION_STORAGE_KEY = "claimsaathi.demo-session.v1";

type SessionStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export interface DemoSessionStore {
  load(): DemoSession | null;
  save(personaId: DemoPersonaId): boolean;
  clear(): boolean;
}

function isDemoSession(value: unknown): value is DemoSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<DemoSession>;
  return (
    candidate.version === DEMO_DATA_VERSION &&
    isDemoPersonaId(candidate.personaId)
  );
}

export function createDemoSessionStore(
  storage: SessionStorage,
): DemoSessionStore {
  return {
    load() {
      try {
        const serialized = storage.getItem(DEMO_SESSION_STORAGE_KEY);

        if (!serialized) {
          return null;
        }

        const parsed: unknown = JSON.parse(serialized);

        if (!isDemoSession(parsed)) {
          storage.removeItem(DEMO_SESSION_STORAGE_KEY);
          return null;
        }

        return parsed;
      } catch {
        try {
          storage.removeItem(DEMO_SESSION_STORAGE_KEY);
        } catch {
          // Storage can be unavailable; the demo still works without recovery.
        }
        return null;
      }
    },
    save(personaId) {
      try {
        const session: DemoSession = {
          version: DEMO_DATA_VERSION,
          personaId,
        };
        storage.setItem(DEMO_SESSION_STORAGE_KEY, JSON.stringify(session));
        return true;
      } catch {
        return false;
      }
    },
    clear() {
      try {
        storage.removeItem(DEMO_SESSION_STORAGE_KEY);
        return true;
      } catch {
        return false;
      }
    },
  };
}
