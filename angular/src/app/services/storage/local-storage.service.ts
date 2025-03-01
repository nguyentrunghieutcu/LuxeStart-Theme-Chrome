import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private localStorageSignal = signal<Record<string, any>>({}); // Sử dụng signal để lưu trữ dữ liệu

  constructor() {
    // Khi service khởi tạo, tải tất cả dữ liệu từ localStorage vào signal
    this.loadAllFromLocalStorage();
  }

  // Lưu dữ liệu vào localStorage
  setItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      this.updateSignal(key, value);
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }

  // Lấy dữ liệu từ localStorage (dùng signal)
  getItem<T>(key: string): T | null {
    try {
      const signalValue = this.localStorageSignal()[key];
      if (signalValue !== undefined) {
        return signalValue as T;
      }

      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return null;
      }

      const value = JSON.parse(serializedValue) as T;
      this.updateSignal(key, value);
      return value;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return null;
    }
  }

  // Xóa dữ liệu từ localStorage
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
      this.removeSignal(key);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  }

  // Xóa tất cả dữ liệu trong localStorage
  clear(): void {
    try {
      localStorage.clear();
      this.localStorageSignal.set({});
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }

  // Tải tất cả dữ liệu từ localStorage vào signal
  private loadAllFromLocalStorage(): void {
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value !== null) {
          data[key] = JSON.parse(value);
        }
      }
    }
    this.localStorageSignal.set(data);
  }

  // Cập nhật signal khi thay đổi localStorage
  private updateSignal(key: string, value: any): void {
    const currentData = this.localStorageSignal();
    currentData[key] = value;
    this.localStorageSignal.set(currentData);
  }

  // Xóa dữ liệu từ signal
  private removeSignal(key: string): void {
    const currentData = this.localStorageSignal();
    delete currentData[key];
    this.localStorageSignal.set(currentData);
  }

  // Sử dụng signal để theo dõi thay đổi trong localStorage
  getLocalStorageSignal() {
    return this.localStorageSignal.asReadonly();
  }
}
