
/**
 * Service for interacting with IndexedDB for local data storage
 */

// Database configuration
const DB_NAME = 'medilog_db';
const DB_VERSION = 1;

// Define store names
export const STORES = {
  HEALTH_REPORTS: 'health_reports',
  VITAL_METRICS: 'vital_metrics',
  MEDICATIONS: 'medications',
  CONSULTATIONS: 'consultations',
  USER_PROFILE: 'user_profile',
  DOCUMENTS: 'documents'
};

/**
 * Initializes the database
 * @returns Promise that resolves when the database is ready
 */
export async function initDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject('Error opening database');
    };
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.HEALTH_REPORTS)) {
        db.createObjectStore(STORES.HEALTH_REPORTS, { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains(STORES.VITAL_METRICS)) {
        db.createObjectStore(STORES.VITAL_METRICS, { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains(STORES.MEDICATIONS)) {
        db.createObjectStore(STORES.MEDICATIONS, { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains(STORES.CONSULTATIONS)) {
        db.createObjectStore(STORES.CONSULTATIONS, { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains(STORES.USER_PROFILE)) {
        db.createObjectStore(STORES.USER_PROFILE, { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains(STORES.DOCUMENTS)) {
        db.createObjectStore(STORES.DOCUMENTS, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

/**
 * Generic function to add an item to a store
 * @param storeName Name of the object store
 * @param item Item to add
 * @returns Promise resolving to the item's ID
 */
export async function addItem<T>(storeName: string, item: T): Promise<number> {
  const db = await initDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const request = store.add(item);
    
    request.onsuccess = () => {
      resolve(request.result as number);
    };
    
    request.onerror = () => {
      reject('Error adding item to store');
    };
  });
}

/**
 * Generic function to get all items from a store
 * @param storeName Name of the object store
 * @returns Promise resolving to an array of items
 */
export async function getAllItems<T>(storeName: string): Promise<T[]> {
  const db = await initDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result as T[]);
    };
    
    request.onerror = () => {
      reject('Error getting items from store');
    };
  });
}

/**
 * Generic function to get an item by ID
 * @param storeName Name of the object store
 * @param id Item ID
 * @returns Promise resolving to the item
 */
export async function getItemById<T>(storeName: string, id: number): Promise<T | undefined> {
  const db = await initDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    
    const request = store.get(id);
    
    request.onsuccess = () => {
      resolve(request.result as T);
    };
    
    request.onerror = () => {
      reject('Error getting item by ID');
    };
  });
}

/**
 * Generic function to update an item
 * @param storeName Name of the object store
 * @param id Item ID
 * @param item Updated item
 * @returns Promise resolving when the update is complete
 */
export async function updateItem<T>(storeName: string, id: number, item: T): Promise<void> {
  const db = await initDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    // Ensure the item has the correct ID
    const itemToUpdate = { ...item, id };
    
    const request = store.put(itemToUpdate);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject('Error updating item');
    };
  });
}

/**
 * Generic function to delete an item
 * @param storeName Name of the object store
 * @param id Item ID
 * @returns Promise resolving when the deletion is complete
 */
export async function deleteItem(storeName: string, id: number): Promise<void> {
  const db = await initDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject('Error deleting item');
    };
  });
}
