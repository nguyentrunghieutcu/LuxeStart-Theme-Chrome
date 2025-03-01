import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private readonly storageKey = 'dark-mode';

  constructor() {
    this.loadTheme();
  }

  toggleDarkMode(isDarkMode): void {
    document.body.classList.toggle('dark', isDarkMode);
    document.body.classList.toggle('light', !isDarkMode);
    localStorage.setItem(this.storageKey, JSON.stringify({ mode: isDarkMode ? 'dark' : 'light' }));

  }

  isDarkMode(): boolean {
    return document.body.classList.contains('dark');
  }
  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.storageKey);
    let isDarkMode = false;

    if (savedTheme) {
      isDarkMode = JSON.parse(savedTheme).mode === 'dark';
    } else {
      isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    document.body.classList.toggle('dark', isDarkMode);
    document.body.classList.toggle('light', !isDarkMode);
  }
}
