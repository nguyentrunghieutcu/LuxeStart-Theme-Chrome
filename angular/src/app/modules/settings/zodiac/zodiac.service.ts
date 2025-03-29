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
    const prompt = `Tạo lời dự đoán tử vi hàng ngày cho cung hoàng đạo ${this.getVietnameseName(sign)} với các khía cạnh sau:
    1. Tổng quan ngày hôm nay
    2. Dự đoán về sự nghiệp và công việc
    3. Tình yêu và các mối quan hệ
    4. Tài chính và tiền bạc
    Trả lời dưới dạng JSON với các trường: overview, career, love, money. Viết bằng tiếng Việt.`;

    this.geminiService.getPromtAi(prompt).subscribe(
      response => {
        const cleanResponse = response
          .replace(/```json\n|\n```/g, '')
          .replace(/\n/g, ' ')
          .replace(/\\/g, '\\\\')
          .replace(/(?<!\\)"/g, '\\"')
          .trim();

        const jsonStr = `{"overview":"${cleanResponse['overview'] || ''}","career":"${cleanResponse['career'] || ''}",
        "love":"${cleanResponse['love'] || ''}","money":"${cleanResponse['money'] || ''}"}`;
        const parsedResponse = JSON.parse(jsonStr);

        console.log(parsedResponse)
        const zodiacInfo: ZodiacInfo = {
          overview: parsedResponse.overview || 'Không thể tải thông tin tổng quan',
          career: parsedResponse.career || 'Không thể tải thông tin sự nghiệp',
          love: parsedResponse.love || 'Không thể tải thông tin tình yêu',
          money: parsedResponse.money || 'Không thể tải thông tin tài chính'
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