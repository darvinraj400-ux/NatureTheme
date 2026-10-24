const STORAGE_PREFIX = 'nature-sustainability_';

export function saveToStorage<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(STORAGE_PREFIX + key, serialized);
    return true;
  } catch {
    return false;
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const serialized = localStorage.getItem(STORAGE_PREFIX + key);
    if (serialized === null) return defaultValue;
    return JSON.parse(serialized) as T;
  } catch {
    return defaultValue;
  }
}

export function removeFromStorage(key: string): boolean {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
    return true;
  } catch {
    return false;
  }
}

export function clearAllStorage(): boolean {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    return true;
  } catch {
    return false;
  }
}
