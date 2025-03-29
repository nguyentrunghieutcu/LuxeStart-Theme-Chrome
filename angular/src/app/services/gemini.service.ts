import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, from, map, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IndexedDBService } from './indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiUrl = environment.apiUrl;
  private defaultGreetings = ['Hi there'];
  private currentGreetingSubject = new Subject<string>(); // Subject để phát hiện greeting mới

  constructor(
    private http: HttpClient,
    private indexedDBService: IndexedDBService
  ) {
    // Initialize default greetings if none exist
    this.initializeGreetings();
  }

  // Phương thức để lấy Subject
  getCurrentGreetingObservable(): Observable<string> {
    return this.currentGreetingSubject.asObservable();
  }

  private async initializeGreetings() {
    const greetings = await this.indexedDBService.getGreetingTexts();
    if (greetings.length === 0) {
      await this.indexedDBService.saveGreetings(this.defaultGreetings);
    }
  }

  // Save greetings to IndexedDB
  async saveGreetings(greetings: string[]): Promise<boolean> {
    return await this.indexedDBService.saveGreetings(greetings);
  }

  // Get greetings from IndexedDB
  async getStoredGreetings(): Promise<string[]> {
    return await this.indexedDBService.getGreetingTexts();
  }

  // Get greeting objects with IDs from IndexedDB
  async getGreetingObjects(): Promise<{ id: number, text: string }[]> {
    return await this.indexedDBService.getAllGreetings();
  }

  // Get a random greeting from IndexedDB
  async getRandomGreeting(): Promise<string> {
    const greetings = await this.getStoredGreetings();
    if (greetings.length === 0) return 'No greetings available';

    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
  }

  // Add a new greeting
  async addGreeting(greeting: string): Promise<boolean> {
    if (!greeting || greeting.trim() === '') return false;
    return await this.indexedDBService.saveGreeting(greeting.trim());
  }

  // Update an existing greeting
  async updateGreeting(id: number, newGreeting: string): Promise<boolean> {
    if (!newGreeting || newGreeting.trim() === '') return false;
    return await this.indexedDBService.updateGreeting(id, newGreeting.trim());
  }

  // Delete a greeting
  async deleteGreeting(id: number): Promise<boolean> {
    return await this.indexedDBService.deleteGreeting(id);
  }

  // Reset to default greetings
  async resetToDefaultGreetings(): Promise<boolean> {
    return await this.indexedDBService.saveGreetings(this.defaultGreetings);
  }

  getPromtAi(text: string): Observable<string> {
    return this.http.post<{ choices?: { message: { content: string } }[] }>(
      `${this.apiUrl}/openai`,
      { prompt: text } // OpenAI API sử dụng "prompt" thay vì "contents"
    ).pipe(
      map(response => {
        if (response.choices?.length > 0) {
          const message = response.choices[0].message.content;
          return message;
        }
        return 'Default greeting message';
      }),
      catchError(() => of('Default greeting message')) // Xử lý lỗi API
    );
  }
  getGreeting(text: string): Observable<string> {
    return this.http.post<{ choices?: { message: { content: string } }[] }>(
      `${this.apiUrl}/openai`,
      { prompt: text } // OpenAI API sử dụng "prompt" thay vì "contents"
    ).pipe(
      map(response => {
        if (response.choices?.length > 0) {
          const message = response.choices[0].message.content;
          // Save the new greeting
          this.addGreeting(message);
          return message;
        }
        return 'Default greeting message';
      }),
      catchError(() => of('Default greeting message')) // Xử lý lỗi API
    );
  }

  async getGreetingById(id: number): Promise<string | null> {
    const greetings = await this.getGreetingObjects(); // Lấy tất cả greetings
    const selectedGreeting = greetings.find(g => g.id === id);
    return selectedGreeting ? selectedGreeting.text : null; // Trả về text của greeting nếu tìm thấy
  }
  
  // Cập nhật greeting và phát hiện thay đổi
  async updateCurrentGreeting(greeting: string): Promise<void> {
    this.currentGreetingSubject.next(greeting); // Phát hiện greeting mới
  }
}
