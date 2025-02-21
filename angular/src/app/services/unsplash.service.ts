import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnsplashService {
  private accessKey = environment.unplash.ack; // Thay bằng API Key của bạn
  private apiUrl = 'https://api.unsplash.com/search/photos';

  constructor() {

  }

  async getImages(query: string, perPage: number = 10): Promise<string[]> {
    const response = await fetch(
      `${this.apiUrl}?query=${query}&per_page=${perPage}&client_id=${this.accessKey}`
    );

    const data = await response.json();
    return data.results.map((photo: any) => photo.urls.regular);
  }
}
