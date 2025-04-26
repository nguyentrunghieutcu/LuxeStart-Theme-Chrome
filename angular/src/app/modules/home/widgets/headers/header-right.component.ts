import { Component, ChangeDetectionStrategy, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
 import { SettingsStateService } from 'src/app/services/settings.service';
import { CurrentWeatherComponent } from 'src/app/components/current-weather/current-weather.component';
import { fuseAnimations } from 'src/@luxstart/animations';
import { ZodiacStorageService } from 'src/app/modules/settings/zodiac/zodiac.service';

@Component({
  selector: 'app-header-right',
  standalone: true,
  imports: [CommonModule, CurrentWeatherComponent],
  templateUrl: './header-right.component.html',
  animations: [fuseAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderRightComponent {
  zodiacStorage = inject(ZodiacStorageService);
  settingsStateService = inject(SettingsStateService);
  @Output() openWidget = new EventEmitter<MouseEvent>();

  openZodiacWidget(event: MouseEvent) {
    // Emit an event to the parent component
    event.stopPropagation();
    const customEvent = new CustomEvent('openZodiacWidget', { 
      bubbles: true, 
      detail: { event } 
    });
    event.target?.dispatchEvent(customEvent);
    this.openWidget.emit(event);
  }

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
}
