import { Injectable } from '@angular/core';

interface KVRecord {
  key: string;
  value: string;
}

interface StorageEventPayload {
  key: string;
  newValue: string | null;
}

@Injectable({ providedIn: 'root' })
export class IndexedDbService {
  private dbPromise: Promise<IDBDatabase>;
  private bc: BroadcastChannel | null = null;
  private readonly STORE_NAME = 'kv';
  private readonly DB_NAME = 'app-storage';
  private readonly DB_VERSION = 1;

  constructor() {
    this.dbPromise = this.initDB();

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.bc = new BroadcastChannel('storage-events');
      } catch {
        this.bc = null;
      }
    }
  }

  // ==== PUBLIC API ====

  async getItem(key: string): Promise<string | null> {
    const db = await this.dbPromise;
    return new Promise<string | null>((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readonly');
      const store = tx.objectStore(this.STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        const rec = req.result as KVRecord | undefined;
        resolve(rec?.value ?? null);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async setItem(key: string, value: string): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction(this.STORE_NAME, 'readwrite');
    tx.objectStore(this.STORE_NAME).put({ key, value });
    await this.waitTx(tx);
    this.broadcast({ key, newValue: value });
  }

  async removeItem(key: string): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction(this.STORE_NAME, 'readwrite');
    tx.objectStore(this.STORE_NAME).delete(key);
    await this.waitTx(tx);
    this.broadcast({ key, newValue: null });
  }

  async clear(): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction(this.STORE_NAME, 'readwrite');
    tx.objectStore(this.STORE_NAME).clear();
    await this.waitTx(tx);
  }

  async getJSON<T>(key: string): Promise<T | null> {
    const raw = await this.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch (err) {
      console.error(
        `[IndexedDbService] Error parsing JSON for key: ${key}`,
        err,
      );
      return null;
    }
  }

  async setJSON(key: string, value: unknown): Promise<void> {
    await this.setItem(key, JSON.stringify(value));
  }

  listen(callback: (msg: StorageEventPayload) => void): () => void {
    if (!this.bc) return () => {};
    const handler = (ev: MessageEvent) => {
      const data = ev.data as StorageEventPayload;
      if (data?.key) {
        callback(data);
      }
    };
    this.bc.addEventListener('message', handler);
    return () => this.bc?.removeEventListener('message', handler);
  }

  private broadcast(payload: StorageEventPayload) {
    try {
      this.bc?.postMessage(payload);
    } catch {}
  }

  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'key' });
        }
      };

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      req.onblocked = () =>
        console.warn('[IndexedDbService] Database open blocked');
    });
  }

  private waitTx(tx: IDBTransaction): Promise<void> {
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () =>
        reject(tx.error || new Error('IndexedDB transaction error'));
      tx.onabort = () =>
        reject(tx.error || new Error('IndexedDB transaction aborted'));
    });
  }
}
