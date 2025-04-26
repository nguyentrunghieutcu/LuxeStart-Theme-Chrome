import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private translations: any = {};
  private currentLang = 'en'; // Mặc định là tiếng Anh

  constructor() {
    this.loadTranslations();
  }

  private async loadTranslations() {
    try {
      const data = await chrome.storage.local.get("translations");
      if (data['translations']) {
        this.translations = data['translations'];
      }
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  setLanguage(lang: string) {
    this.currentLang = lang;
  }

  getMessage(key: string): string {
    return this.translations[this.currentLang]?.[key]?.message || key;
  }
}
