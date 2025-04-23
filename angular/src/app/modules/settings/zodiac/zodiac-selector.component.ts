import { Component, ChangeDetectionStrategy, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { zodiacColors } from './models/zodiac-colors.model';
import { DarkModeService } from 'src/app/services/darkmode.service';

@Component({
  selector: 'app-zodiac-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-hidden p-3 rounded-lg dark:bg-gray-800 bg-white border border-gray-200 dark:border-gray-600 shadow-xs">
      <div class="grid grid-cols-3 gap-4 p-4">
        <button *ngFor="let sign of zodiacSigns"
          (click)="selectSign(sign)"
          [style.background]="getZodiacColor(sign)"
          class="p-4 rounded-xl hover:scale-105 transition-all duration-300 group relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <img [src]="'assets/zodiac/' + sign + '.png'" [alt]="getVietnameseName(sign)"
            class="w-8 h-8 mx-auto mb-3 text-white filter brightness-0 invert">
          <span class="text-sm text-white font-medium">{{getVietnameseName(sign)}}</span>
        </button>
      </div>
      <div data-popper-arrow></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZodiacSelectorComponent {
  zodiacSigns = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];

  darkModeService = inject(DarkModeService);
  @Output() signSelected = new EventEmitter<string>();
  @Output() closePopover = new EventEmitter<void>();

  getVietnameseName(sign: string): string {
    const signMap: Record<string, string> = {
      'aries': 'Bạch Dương',
      'taurus': 'Kim Ngưu',
      'gemini': 'Song Tử',
      'cancer': 'Cự Giải',
      'leo': 'Sư Tử',
      'virgo': 'Xử Nữ',
      'libra': 'Thiên Bình',
      'scorpio': 'Bọ Cạp',
      'sagittarius': 'Nhân Mã',
      'capricorn': 'Ma Kết',
      'aquarius': 'Bảo Bình',
      'pisces': 'Song Ngư'
    };
    return signMap[sign] || sign;
  }

  getZodiacColor(sign: string): string {
    const isDark = this.darkModeService.isDarkMode();
    return isDark
      ? zodiacColors[sign]?.dark
      : zodiacColors[sign]?.light || 'linear-gradient(135deg, #F5F5F5, #E0E0E0)';
  }

  selectSign(sign: string) {
    // Emit the selected sign and close the popover
    this.signSelected.emit(sign);
    this.closePopover.emit();
  }
}