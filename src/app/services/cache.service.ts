import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class CacheService {
  private dbName = 'GithubExplorerDB'
  private storeName = 'users'

  async openDB() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'login' })
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveUser(user: any, repos: any[]) {
    const db = await this.openDB()
    const tx = db.transaction(this.storeName, 'readwrite')
    const store = tx.objectStore(this.storeName)
    store.put({ ...user, cachedRepos: repos, timestamp: Date.now() })
  }

  async getHistory(): Promise<any[]> {
    const db = await this.openDB()
    return new Promise((resolve) => {
      const tx = db.transaction(this.storeName, 'readonly')
      const store = tx.objectStore(this.storeName)
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result.sort((a, b) => b.timestamp - a.timestamp))
    })
  }
}
