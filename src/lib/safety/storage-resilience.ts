/**
 * Safe LocalStorage Wrapper with In-Memory Fallback.
 *
 * Prevents application crashes in restrictive browser environments,
 * incognito modes, or when storage quotas are exceeded.
 */

class InMemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

const memoryStorage = new InMemoryStorage();

export function getSafeStorage(customStorage?: Storage): Storage {
  if (customStorage) return customStorage;

  if (typeof window === "undefined") {
    return memoryStorage;
  }

  try {
    const testKey = "__claimsaathi_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return memoryStorage;
  }
}

export function isPersistentBrowserStorage(storage: Storage): boolean {
  if (typeof window === "undefined") return false;

  try {
    return storage === window.localStorage;
  } catch {
    return false;
  }
}

export function safeStorageGet<T>(
  key: string,
  storage: Storage = getSafeStorage(),
): T | null {
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function safeStorageSet<T>(
  key: string,
  value: T,
  storage: Storage = getSafeStorage(),
): boolean {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // If setting fails (e.g. QuotaExceeded), save to memory fallback
    try {
      memoryStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
}

export function safeStorageRemove(
  key: string,
  storage: Storage = getSafeStorage(),
): void {
  try {
    storage.removeItem(key);
  } catch {
    memoryStorage.removeItem(key);
  }
}
