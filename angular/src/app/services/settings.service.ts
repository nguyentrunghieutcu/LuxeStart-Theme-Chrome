import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsStateService {
  // Sử dụng signal để quản lý trạng thái ẩn/hiện của các component
  private _showWeather = signal<boolean>(true);
  private _showClock = signal<boolean>(true);
  private _showMantra = signal<boolean>(true);
  private _showFooter = signal<boolean>(true);
  private _showTask = signal<boolean>(true);
  private _showZodiac = signal(true);
  
  // Expose signals as read-only
  showWeather = this._showWeather.asReadonly();
  showClock = this._showClock.asReadonly();
  showMantra = this._showMantra.asReadonly();
  showFooter = this._showFooter.asReadonly();
  showTask = this._showTask.asReadonly();

  constructor() {
    // Load saved states from localStorage
    this.loadStates();
  }

  // Phương thức để bật/tắt các component
  toggleWeather(show: boolean): void {
    this._showWeather.set(show);
    this.saveState('showWeather', show);
  }

  toggleClock(show: boolean): void {
    this._showClock.set(show);
    this.saveState('showClock', show);
  }

  toggleMantra(show: boolean): void {
    this._showMantra.set(show);
    this.saveState('showMantra', show);
  }

  toggleFooter(show: boolean): void {
    this._showFooter.set(show);
    this.saveState('showFooter', show);
  }

  toggleTask(show: boolean): void {
    this._showTask.set(show);
    this.saveState('showTask', show);
  }

  // Lưu trạng thái vào localStorage
  private saveState(key: string, value: boolean): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Tải trạng thái từ localStorage
  private loadStates(): void {
    this._showWeather.set(JSON.parse(localStorage.getItem('showWeather') || 'true'));
    this._showClock.set(JSON.parse(localStorage.getItem('showClock') || 'true'));
    this._showMantra.set(JSON.parse(localStorage.getItem('showMantra') || 'true'));
    this._showFooter.set(JSON.parse(localStorage.getItem('showFooter') || 'true'));
    this._showTask.set(JSON.parse(localStorage.getItem('showTask') || 'true'));
  }

  showZodiac(): Signal<boolean> {
    return this._showZodiac.asReadonly();
  }

  toggleZodiac(): void {
    this._showZodiac.set(!this._showZodiac());
   }
}