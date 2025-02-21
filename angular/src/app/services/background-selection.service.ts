import { Injectable, computed, signal } from '@angular/core';
import { Backgrounds } from '../modules/home/tab.model';
import { IndexedDBService } from './indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class BackgroundSelectionService {
  private selectedBackgroundSignal = signal<any | null>(null);
  private backgrounds = Backgrounds; // Danh sách ảnh nền
  constructor(private indexedDBService: IndexedDBService) {
  }
  selectedBackground = computed(() => {
    return this.selectedBackgroundSignal() || this.getBackgroundBasedOnTime();
  });

  async toggleSelection(image) {
    this.selectedBackgroundSignal.set(image);
    await this.indexedDBService.saveSelectedBackground(image); // Lưu riêng ảnh nền
  }

  async loadStoredBackground() {
    const storedBackground = await this.indexedDBService.getSelectedBackground();
    console.log(storedBackground);
    if (storedBackground) {
      this.selectedBackgroundSignal.set(storedBackground);
    }
  }
  private getBackgroundBasedOnTime() {
    const currentHour = new Date().getHours();
    let selectedRange: string;

    if (currentHour >= 5 && currentHour < 12) {
      selectedRange = 'morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      selectedRange = 'afternoon';
    } else if (currentHour >= 17 && currentHour < 20) {
      selectedRange = 'evening';
    } else {
      selectedRange = 'night';
    }

    const backgroundsForTime = this.backgrounds.filter(bg => bg.time === selectedRange);
    if (backgroundsForTime.length > 0) {
      return backgroundsForTime[Math.floor(Math.random() * backgroundsForTime.length)];
    }

    return ''; // Trả về rỗng nếu không có ảnh nào phù hợp
  }
}
