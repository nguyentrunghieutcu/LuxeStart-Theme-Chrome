import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IndexedDBService } from './indexed-db.service';

export interface Mantra {
  id: number;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class MantraService {
  private readonly http = inject(HttpClient);
  private readonly indexedDBService = inject(IndexedDBService);
  private readonly apiUrl = environment.apiUrl;
  
  public defaultMantras = [
    'I am capable of achieving anything I set my mind to',
    'Every day in every way, I am getting better and better',
    'I choose to be confident and self-assured',
    'I am worthy of great things',
    'I create my own opportunities'
  ];

  constructor() {
    this.initializeMantras();
  }

  private async initializeMantras(): Promise<void> {
    const mantras = await this.indexedDBService.getMantraTexts();
    if (!mantras.length) {
      await this.indexedDBService.saveMantras(this.defaultMantras);
    }
  }

  // Save mantras to IndexedDB
  async saveMantras(mantras: string[]): Promise<boolean> {
    return await this.indexedDBService.saveMantras(mantras);
  }

  // Get mantras from IndexedDB
  async getStoredMantras(): Promise<string[]> {
    return await this.indexedDBService.getMantraTexts();
  }

  // Get mantra objects with IDs from IndexedDB
  async getMantraObjects(): Promise<{id: number, text: string}[]> {
    return await this.indexedDBService.getAllMantras();
  }

  // Get a random mantra from IndexedDB
  async getRandomMantra(): Promise<string> {
    const mantras = await this.getStoredMantras();
    if (mantras.length === 0) return 'No mantras available';

    const randomIndex = Math.floor(Math.random() * mantras.length);
    return mantras[randomIndex];
  }
  
  // Add a new mantra
  async addMantra(mantra: string): Promise<boolean> {
    if (!mantra || mantra.trim() === '') return false;
    return await this.indexedDBService.saveMantra(mantra.trim());
  }

  // Update an existing mantra
  async updateMantra(id: number, newMantra: string): Promise<boolean> {
    if (!newMantra || newMantra.trim() === '') return false;
    return await this.indexedDBService.updateMantra(id, newMantra.trim());
  }

  // Delete a mantra
  async deleteMantra(id: number): Promise<boolean> {
    return await this.indexedDBService.deleteMantra(id);
  }

  // Reset to default mantras
  async resetToDefaultMantras(): Promise<boolean> {
    return await this.indexedDBService.saveMantras(this.defaultMantras);
  }
  
  // Get mantra from OpenAI
  getMantra(prompt: string): Observable<string> {
    return this.http.post<{ choices?: { message: { content: string } }[] }>(
      `${this.apiUrl}/openai`,
      { 
        prompt: `Tạo ra một khẩu hiệu thần chú chỉ 5 từ để truyền cảm hứng và động viên dựa trên chủ đề này: ${prompt}` 
      }
    ).pipe(
      map(response => {
        const message = response.choices?.[0]?.message?.content ?? 'Believe in yourself and all that you are';
        void this.addMantra(message);
        return message;
      }),
      catchError(() => of('Believe in yourself and all that you are'))
    );
  }
}