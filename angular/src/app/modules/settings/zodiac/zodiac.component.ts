import { Component, ChangeDetectionStrategy, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { ZodiacSelectorComponent } from './zodiac-selector.component';
import { GeminiService } from 'src/app/services/gemini.service';
import { MatTabsModule } from '@angular/material/tabs';
import { ZodiacStorageService } from './zodiac.service';
 
export interface ZodiacInfo {
  overview: string;
  career: string;
  love: string;
  money: string;
}

@Component({
  selector: 'app-zodiac',
  standalone: true,
  imports: [CommonModule, MatDialogModule, LucideAngularModule, FormsModule, MatTabsModule],
  template: `
    <div class="relative">
      <div class="flex items-center gap-2 cursor-pointer p-2" (click)="isExpanded = !isExpanded">
        <img *ngIf="selectedSign" [src]="'src/assets/zodiac/' + selectedSign + '.png'" 
          class="w-6 h-6" [alt]="selectedSign">
        <span class="text-white text-sm">{{selectedSign ? getVietnameseName(selectedSign) : 'Tử Vi'}}</span>
        <lucide-icon [name]="isExpanded ? 'chevron-up' : 'chevron-down'" 
          class="w-4 h-4 text-white/70"></lucide-icon>
      </div>        

      <div *ngIf="isExpanded" 
        class="absolute top-full right-0 mt-2 w-80 bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden">
        <div class="p-4">
          <div *ngIf="!selectedSign" class="text-center">
            <button (click)="openZodiacSelector()" 
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-all duration-300">
              <span class="flex items-center gap-2">
                <lucide-icon name="sparkles" class="w-4 h-4"></lucide-icon>
                Chọn Cung Hoàng Đạo
              </span>
            </button>
          </div>

          <div *ngIf="selectedSign" class="space-y-4">
            <mat-tab-group class="zodiac-tabs" mat-stretch-tabs="false" mat-align-tabs="start">
              <mat-tab *ngFor="let category of categories">
                <ng-template mat-tab-label>
                  <span class="text-xs font-medium">{{getCategoryName(category)}}</span>
                </ng-template>
                <div class="pt-4">
                  <p class="text-sm text-white/90 leading-relaxed">{{zodiacInfo[category]}}</p>
                </div>
              </mat-tab>
            </mat-tab-group>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    ::ng-deep .zodiac-tabs {
      .mat-mdc-tab-header {
        --mdc-tab-indicator-active-indicator-color: white;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      
      .mat-mdc-tab-labels {
        gap: 8px;
      }

      .mdc-tab {
        padding: 0 12px;
        height: 36px;
      }

      .mdc-tab--active {
        background: rgba(255,255,255,0.1);
        border-radius: 6px 6px 0 0;
      }

      .mdc-tab__text-label {
        color: rgba(255,255,255,0.7);
      }

      .mdc-tab--active .mdc-tab__text-label {
        color: white;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// Add birthDate to component properties
export class ZodiacComponent {
  private dialog = inject(MatDialog);
  private zodiacStorage = inject(ZodiacStorageService);
  
  selectedSign: string | null = null;
  categories = ['overview', 'career', 'love', 'money'];
  zodiacInfo: ZodiacInfo = {
    overview: '',
    career: '',
    love: '',
    money: ''
  };
  birthDate: string = '';

  getCategoryName(category: string): string {
    const categoryMap: Record<string, string> = {
      'overview': 'Tổng Quan',
      'career': 'Sự Nghiệp',
      'love': 'Tình Yêu',
      'money': 'Tài Chính'
    };
    return categoryMap[category] || category;
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

  openZodiacSelector() {
    // Open zodiac selection dialog
    const dialogRef = this.dialog.open(ZodiacSelectorComponent, {
      width: '400px',
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedSign = result;
        this.updateZodiacInfo();
      }
    });
  }

  ngOnInit() {
    const savedData = this.zodiacStorage.getZodiacInfo();
    if (savedData && this.zodiacStorage.isDataValid(savedData.timestamp)) {
      this.selectedSign = savedData.sign;
      this.zodiacInfo = savedData.info;
    }
  }

  private updateZodiacInfo() {
    // if (this.selectedSign) {
    //   this.zodiacStorage.fetchZodiacInfo(this.selectedSign)
    //     .subscribe(info => this.zodiacInfo = info);
    // }
  }
  isExpanded = false;
  
  // Add method to set birthDate
  setBirthDate(date: string) {
    this.birthDate = date;
  }
}