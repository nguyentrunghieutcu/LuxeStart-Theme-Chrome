import { Injectable, computed, inject, signal } from '@angular/core';
import { ZodiacInfo } from './zodiac.component';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { GeminiService } from 'src/app/services/gemini.service';

@Injectable({
  providedIn: 'root'
})
export class ZodiacStorageService {
  private readonly STORAGE_KEY = 'zodiac_info';
  private geminiService = inject(GeminiService);

  // Signals for state management
  private _selectedSign = signal<string | null>(null);
  private _zodiacInfo = signal<ZodiacInfo | null>(null);

  // Computed signals
  readonly selectedSign = computed(() => this._selectedSign());
  readonly zodiacInfo = computed(() => this._zodiacInfo());

  // Update methods to use signals
  setSelectedSign(sign: string) {
    this._selectedSign.set(sign);
  }

  saveZodiacInfo(sign: string, info: ZodiacInfo): void {
    const data = {
      sign,
      info,
      timestamp: new Date().getTime()
    };
    console.log(data)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    this._selectedSign.set(sign);
    this._zodiacInfo.set(info);
  }

  getZodiacInfo(): { sign: string; info: ZodiacInfo; timestamp: number } | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  isDataValid(timestamp: number): boolean {
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    return (now - timestamp) < oneDay;
  }

  fetchZodiacInfo(sign: string) {
    const prompt = `Viết lời dự đoán tử vi hôm nay cho cung hoàng đạo ${this.getVietnameseName(sign)}. 
    Yêu cầu:
    - Chỉ viết phần tổng quan
    - Viết bằng tiếng Việt
    - Ngắn gọn, súc tích (khoảng 2-3 câu)
    - Không thêm các ký tự đặc biệt hoặc định dạng
    - Không thêm tiêu đề hoặc phần mở đầu`;

    this.geminiService.getPromtAi(prompt).subscribe(
      response => {
        const cleanResponse = response
          .replace(/\*\*.*?\*\*/g, '')
          .replace(/^[^:]*:/g, '')  // Remove any prefix before colon
          .replace(/[\n\r]+/g, ' ') // Replace multiple newlines with single space
          .trim();

        const zodiacInfo: ZodiacInfo = {
          overview: cleanResponse || 'Không thể tải thông tin tổng quan',
        };
        this.saveZodiacInfo(sign, zodiacInfo);
        return zodiacInfo;
      },
    );
  }

  private getVietnameseName(sign: string): string {
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
