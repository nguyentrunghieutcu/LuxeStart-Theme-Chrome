import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key='; // Replace with actual Gemini AI endpoint
  private storageKey = 'greetings';

  constructor(private http: HttpClient) { 
    this.apiUrl =  this.apiUrl + environment.geminiKey
  }

  // Fetch greetings from the API
  fetchGreetings(): Observable<string[]> {
    return this.http.get<{ content: string[] }>(this.apiUrl).pipe(
      map(response => response.content),
      catchError(() => of([])) // Return an empty array in case of error
    );
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
    const storedGreetings = this.getStoredGreetings();
    // if (storedGreetings.length > 0) {
    //   // Return a random greeting from localStorage
    //   return of(this.getRandomGreeting());
    // }
    return this.http.post<{ candidates: Array<{ content: { parts: Array<{ text: string }> } }> }>(this.apiUrl,
      { "contents": [{ "parts": [{ "text": text }] }] }).pipe(map(response => {
        // Extract the text from the first candidate
        if (response.candidates && response.candidates.length > 0) {
          this.saveGreetings([response.candidates[0].content.parts[0].text]);
          return response.candidates[0].content.parts[0].text;
        }
        return 'Default greeting message'; // 
      }))
  }
}
