import {
  DEMO_DATA_VERSION,
  isDemoPersonaId,
  type DemoClaimEvent,
  type DemoClaimStatus,
  type DemoClaimTimelineRecord,
  type DemoNextAction,
  type DemoPersonaId,
} from "@/lib/demo/model";

export const DEMO_TIMELINE_STORAGE_KEY = "claimsaathi.demo-timeline.v1";

type SessionStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export interface TimelineStore {
  load(personaId: DemoPersonaId): DemoClaimTimelineRecord | null;
  save(record: DemoClaimTimelineRecord): boolean;
  clear(personaId: DemoPersonaId): boolean;
  clearAll(): boolean;
}

const validStatuses: readonly DemoClaimStatus[] = [
  "draft",
  "submitted",
  "under_process",
  "action_needed",
  "approved",
  "settled",
  "rejected",
];

function isDemoClaimStatus(value: unknown): value is DemoClaimStatus {
  return (
    typeof value === "string" &&
    validStatuses.includes(value as DemoClaimStatus)
  );
}

function isClaimEvent(value: unknown): value is DemoClaimEvent {
  if (!value || typeof value !== "object") return false;
  const c = value as Partial<DemoClaimEvent>;
  return (
    typeof c.id === "string" &&
    typeof c.occurredOn === "string" &&
    typeof c.title === "string" &&
    typeof c.description === "string"
  );
}

function isNextAction(value: unknown): value is DemoNextAction {
  if (!value || typeof value !== "object") return false;
  const c = value as Partial<DemoNextAction>;
  return typeof c.title === "string" && typeof c.description === "string";
}

function isClaimTimelineRecord(
  value: unknown,
): value is DemoClaimTimelineRecord {
  if (!value || typeof value !== "object") return false;
  const c = value as Partial<DemoClaimTimelineRecord>;
  return (
    c.version === DEMO_DATA_VERSION &&
    isDemoPersonaId(c.personaId) &&
    typeof c.claimId === "string" &&
    (c.acknowledgementNumber === undefined ||
      typeof c.acknowledgementNumber === "string") &&
    isDemoClaimStatus(c.status) &&
    typeof c.requestedAmountRupees === "number" &&
    Array.isArray(c.events) &&
    c.events.every(isClaimEvent) &&
    typeof c.updatedAt === "string" &&
    isNextAction(c.pendingAction)
  );
}

type TimelineMap = Partial<Record<DemoPersonaId, DemoClaimTimelineRecord>>;

function readMap(storage: SessionStorage): TimelineMap {
  try {
    const raw = storage.getItem(DEMO_TIMELINE_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const result: TimelineMap = {};
    for (const [key, val] of Object.entries(parsed)) {
      if (isDemoPersonaId(key) && isClaimTimelineRecord(val)) {
        result[key] = val;
      }
    }
    return result;
  } catch {
    return {};
  }
}

export function createTimelineStore(storage: SessionStorage): TimelineStore {
  return {
    load(personaId) {
      const map = readMap(storage);
      return map[personaId] ?? null;
    },
    save(record) {
      try {
        const map = readMap(storage);
        map[record.personaId] = record;
        storage.setItem(DEMO_TIMELINE_STORAGE_KEY, JSON.stringify(map));
        return true;
      } catch {
        return false;
      }
    },
    clear(personaId) {
      try {
        const map = readMap(storage);
        delete map[personaId];
        storage.setItem(DEMO_TIMELINE_STORAGE_KEY, JSON.stringify(map));
        return true;
      } catch {
        return false;
      }
    },
    clearAll() {
      try {
        storage.removeItem(DEMO_TIMELINE_STORAGE_KEY);
        return true;
      } catch {
        return false;
      }
    },
  };
}
