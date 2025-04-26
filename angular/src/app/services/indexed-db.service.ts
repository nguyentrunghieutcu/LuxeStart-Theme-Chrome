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
  greetings: {
    key: number;  // Thay đổi key thành number vì autoIncrement
    value: {
      id?: number;  // Làm cho id là optional và number
      text: string;
    };
    indexes: { 'by-text': string };
  };
  mantras: {
    key: number;
    value: {
      id?: number;
      text: string;
    };
    indexes: { 'by-text': string };
  };
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private db: Promise<IDBPDatabase<MyDB>>;

  constructor() {
    this.db = openDB<MyDB>('MyDatabase', 5, { // Tăng version lên 5 cho greetings store
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
        if (oldVersion < 4) {
          const greetingsStore = db.createObjectStore('greetings', { 
            keyPath: 'id',
            autoIncrement: true
          });
          // Tạo index cho việc tìm kiếm theo text
          greetingsStore.createIndex('by-text', 'text', { unique: true });
        }
        if (oldVersion < 5) {
          const mantrasStore = db.createObjectStore('mantras', {
            keyPath: 'id',
            autoIncrement: true
          });
          mantrasStore.createIndex('by-text', 'text', { unique: true });
        }
      },
    });

  }

  // Greeting methods
  async saveGreeting(text: string) {
    try {
      const db = await this.db;
      const tx = db.transaction('greetings', 'readwrite');
      const store = tx.objectStore('greetings');
      
      // Kiểm tra xem greeting có tồn tại chưa
      const index = store.index('by-text');
      const existingGreeting = await index.getKey(text);
      
      if (!existingGreeting) {
        // Nếu chưa tồn tại, thêm mới
        await store.add({ text });
        console.log('Đã thêm lời chào mới');
      } else {
        console.log('Lời chào đã tồn tại');
      }
      
      await tx.done;
      return true;
    } catch (error) {
      console.error('Lỗi khi lưu lời chào:', error);
      return false;
    }
  }

  async saveGreetings(greetings: string[]) {
    try {
      const db = await this.db;
      const tx = db.transaction('greetings', 'readwrite');
      const store = tx.objectStore('greetings');
      
      // Xóa tất cả greetings cũ
      await store.clear();
      
      // Thêm greetings mới
      for (const text of greetings) {
        await store.add({ text });
      }
      
      await tx.done;
      console.log('Đã lưu danh sách lời chào');
      return true;
    } catch (error) {
      console.error('Lỗi khi lưu danh sách lời chào:', error);
      return false;
    }
  }

  async getAllGreetings() {
    try {
      const db = await this.db;
      const tx = db.transaction('greetings', 'readonly');
      const store = tx.objectStore('greetings');
      
      const greetings = await store.getAll();
      return greetings.map(g => ({ id: g.id, text: g.text }));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách lời chào:', error);
      return [];
    }
  }

  async getGreetingTexts() {
    try {
      const greetings = await this.getAllGreetings();
      return greetings.map(g => g.text);
    } catch (error) {
      console.error('Lỗi khi lấy nội dung lời chào:', error);
      return [];
    }
  }

  async updateGreeting(id: number, newText: string) {
    try {
      const db = await this.db;
      const tx = db.transaction('greetings', 'readwrite');
      const store = tx.objectStore('greetings');
      
      // Lấy greeting hiện tại
      const greeting = await store.get(id);
      if (!greeting) {
        console.error('Không tìm thấy lời chào để cập nhật');
        return false;
      }
      
      // Cập nhật và lưu
      greeting.text = newText;
      await store.put(greeting);
      await tx.done;
      
      console.log('Đã cập nhật lời chào');
      return true;
    } catch (error) {
      console.error('Lỗi khi cập nhật lời chào:', error);
      return false;
    }
  }

  async deleteGreeting(id: number) {
    try {
      const db = await this.db;
      await db.delete('greetings', id);
      console.log('Đã xóa lời chào');
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa lời chào:', error);
      return false;
    }
  }

  async saveUnsplashImages(images: { id: string; url: string; location: string; photographer: string }[]) {
    try {
      const db = await this.db;
      const transaction = db.transaction('unsplashImages', 'readwrite');
      const store = transaction.objectStore('unsplashImages');
  
      for (const image of images) {
        const existing = await store.get(image.id);
        if (!existing) {
          await store.put(image); // Chỉ lưu nếu chưa có
        }
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
      const store = db.transaction('unsplashImages', 'readonly').objectStore('unsplashImages');
  
      let images = await store.getAll(null, 10);
  
      // Dùng Set để loại bỏ ID trùng
      const seenIds = new Set();
      const uniqueImages = images.filter(img => {
        if (seenIds.has(img.id)) return false;
        seenIds.add(img.id);
        return true;
      });
  
      return uniqueImages;
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

  // Mantra methods
  async saveMantra(text: string) {
    try {
      const db = await this.db;
      const tx = db.transaction('mantras', 'readwrite');
      const store = tx.objectStore('mantras');
      
      // Check if mantra already exists
      const index = store.index('by-text');
      const existingMantra = await index.getKey(text);
      
      if (!existingMantra) {
        await store.add({ text });
        console.log('Added new mantra');
      } else {
        console.log('Mantra already exists');
      }
      
      await tx.done;
      return true;
    } catch (error) {
      console.error('Error saving mantra:', error);
      return false;
    }
  }

  async saveMantras(mantras: string[]) {
    try {
      const db = await this.db;
      const tx = db.transaction('mantras', 'readwrite');
      const store = tx.objectStore('mantras');
      
      await store.clear();
      
      for (const text of mantras) {
        await store.add({ text });
      }
      
      await tx.done;
      console.log('Saved mantra list');
      return true;
    } catch (error) {
      console.error('Error saving mantra list:', error);
      return false;
    }
  }

  async getAllMantras() {
    try {
      const db = await this.db;
      const tx = db.transaction('mantras', 'readonly');
      const store = tx.objectStore('mantras');
      
      const mantras = await store.getAll();
      return mantras.map(m => ({ id: m.id, text: m.text }));
    } catch (error) {
      console.error('Error getting mantra list:', error);
      return [];
    }
  }

  async getMantraTexts() {
    try {
      const mantras = await this.getAllMantras();
      return mantras.map(m => m.text);
    } catch (error) {
      console.error('Error getting mantra texts:', error);
      return [];
    }
  }

  async updateMantra(id: number, newText: string) {
    try {
      const db = await this.db;
      const tx = db.transaction('mantras', 'readwrite');
      const store = tx.objectStore('mantras');
      
      const mantra = await store.get(id);
      if (!mantra) {
        console.error('Mantra not found for update');
        return false;
      }
      
      mantra.text = newText;
      await store.put(mantra);
      await tx.done;
      
      console.log('Updated mantra');
      return true;
    } catch (error) {
      console.error('Error updating mantra:', error);
      return false;
    }
  }

  async deleteMantra(id: number) {
    try {
      const db = await this.db;
      await db.delete('mantras', id);
      console.log('Deleted mantra');
      return true;
    } catch (error) {
      console.error('Error deleting mantra:', error);
      return false;
    }
  }
}
