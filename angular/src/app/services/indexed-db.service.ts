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
  unsplashImages: {
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
    this.db = openDB<MyDB>('MyDatabase', 3, { // Tăng version lên 3
      upgrade(db, oldVersion, newVersion) {
        if (oldVersion < 1) {
          db.createObjectStore('images', { keyPath: 'id' });
        }
        if (oldVersion < 2) {
          db.createObjectStore('selectedBackground'); // Store lưu ảnh nền
        }
        if (oldVersion < 3) {
          db.createObjectStore('unsplashImages', { keyPath: 'id' }); // Store mới cho ảnh Unsplash
        }
      },
    });
    
  }

  async saveUnsplashImages(images: { id: string; url: string; location: string; photographer: string }[]) {
    try {
      const db = await this.db;
      const transaction = db.transaction('unsplashImages', 'readwrite');
      const store = transaction.objectStore('unsplashImages');
  
      for (const image of images) {
        await store.put(image);
      }
  
      await transaction.done;
      console.log('Lưu ảnh từ Unsplash thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu ảnh từ Unsplash:', error);
    }
  }
  
  async getUnsplashImages() {
    try {
      const db = await this.db;
      return await db.getAll('unsplashImages');
    } catch (error) {
      console.error('Lỗi khi lấy ảnh từ Unsplash:', error);
      return [];
    }
  }
  
  async deleteUnsplashImage(id: string) {
    try {
      const db = await this.db;
      await db.delete('unsplashImages', id);
      console.log('Xóa ảnh thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa ảnh:', error);
    }
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
