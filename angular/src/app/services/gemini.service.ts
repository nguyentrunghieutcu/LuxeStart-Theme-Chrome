import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiUrl = environment.apiUrl;
  private storageKey = 'greetings';

  constructor(private http: HttpClient) {
  }

  // Save greetings to localStorage
  saveGreetings(greetings: string[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(greetings));
  }

  // Get greetings from localStorage
  getStoredGreetings(): string[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  // Get a random greeting from localStorage
  getRandomGreeting(): string {
    const greetings = this.getStoredGreetings();
    if (greetings.length === 0) return 'No greetings available';

    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
  }
  
  getGreeting(text: string): Observable<string> {
    return this.http.post<{ choices?: { message: { content: string } }[] }>(
        `${this.apiUrl}/openai`,
        { prompt: text } // OpenAI API sử dụng "prompt" thay vì "contents"
    ).pipe(
        map(response => {
            if (response.choices?.length > 0) {
                const message = response.choices[0].message.content;
                this.saveGreetings([message]); // Lưu lại kết quả
                return message;
            }
            return 'Default greeting message';
        }),
        catchError(() => of('Default greeting message')) // Xử lý lỗi API
    );
}


}
