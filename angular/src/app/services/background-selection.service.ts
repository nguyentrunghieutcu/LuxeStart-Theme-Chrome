import { Injectable, computed, signal } from '@angular/core';
import { Backgrounds } from '../modules/home/tab.model';
import { IndexedDBService } from './indexed-db.service';
import { v4 as uuidv4 } from 'uuid';
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

  async toggleSelection(image, type: string = 'library') {
    if (type === 'unsplash') {
      image = {
        id: this.generateId(image),
        url: image,
        location: 'Unknown Location',
        photographer: 'Unknown Photographer',
      }
    }
    this.selectedBackgroundSignal.set(image);
    await this.indexedDBService.saveSelectedBackground(image);
  }

  private generateId(url: string): string {
    return url.split('/').pop() || uuidv4();
  }

  async loadStoredBackground() {
    const storedBackground = await this.indexedDBService.getSelectedBackground();
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
