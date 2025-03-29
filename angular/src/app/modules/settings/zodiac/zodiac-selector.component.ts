import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { zodiacColors } from './models/zodiac-colors.model';
import { DarkModeService } from 'src/app/services/darkmode.service';

@Component({
  selector: 'app-zodiac-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-hidden p-6 rounded-md dark:bg-gray-950 bg-slate-300   backdrop-blur-lg">
      <h2 class="text-xl font-semibold mb-6 text-white text-center">Chọn Cung Hoàng Đạo</h2>
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
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZodiacSelectorComponent {
  zodiacSigns = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];

  darkModeService = inject(DarkModeService)
  constructor(private dialogRef: MatDialogRef<ZodiacSelectorComponent>) {}

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
    this.dialogRef.close(sign);
  }
}