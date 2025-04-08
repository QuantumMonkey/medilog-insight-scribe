
/**
 * A service for interacting with localStorage with type safety
 */

// Define a generic type for storage operations
type StorageItem<T> = {
  key: string;
  defaultValue: T;
};

/**
 * Gets an item from localStorage
 * @param key Storage key
 * @param defaultValue Default value if item doesn't exist
 * @returns The stored value or default value
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Sets an item in localStorage
 * @param key Storage key
 * @param value Value to store
 * @returns true if successful, false otherwise
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
    return false;
  }
}

/**
 * Removes an item from localStorage
 * @param key Storage key
 * @returns true if successful, false otherwise
 */
export function removeStorageItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
}

/**
 * Creates a typed storage object for consistent access to a specific item
 * @param config Storage item configuration
 * @returns Object with get, set, and remove methods
 */
export function createStorageItem<T>({ key, defaultValue }: StorageItem<T>) {
  return {
    get: () => getStorageItem<T>(key, defaultValue),
    set: (value: T) => setStorageItem<T>(key, value),
    remove: () => removeStorageItem(key),
  };
}
