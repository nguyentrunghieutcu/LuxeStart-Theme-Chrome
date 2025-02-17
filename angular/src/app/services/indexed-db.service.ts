import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface MyDB extends DBSchema {
  images: {
    key: string;
    value: {
      id: string;
      url: string;
      location: string;
      photographer: string;
    };
  };
  selectedBackground: {
    key: string;
    value: {
      id: string;
      url: string;
      location: string;
      photographer: string;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private db: Promise<IDBPDatabase<MyDB>>;

  constructor() {
    this.db = openDB<MyDB>('MyDatabase', 2, { // Tăng version lên 2
      upgrade(db, oldVersion, newVersion) {
        if (oldVersion < 1) {
          db.createObjectStore('images', { keyPath: 'id' });
        }
        if (oldVersion < 2) {
          db.createObjectStore('selectedBackground'); // Tạo store mới
        }
      },
    });
  }

  async addImage(image: { id: string; url: string; location: string; photographer: string }) {
    return (await this.db).put('images', image);
  }

  async getImages() {
    return (await this.db).getAll('images');
  }

  async deleteImage(id: string) {
    return (await this.db).delete('images', id);
  }

  // Lưu ảnh nền được chọn
  async saveSelectedBackground(image: { id: string; url: string; location: string; photographer: string }) {
    return (await this.db).put('selectedBackground', image, 'current'); // Key cố định "current"
  }

  // Lấy ảnh nền đã lưu
  async getSelectedBackground() {
     return (await this.db).get('selectedBackground', 'current');
  }
}
