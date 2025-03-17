import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnsplashService {
  private apiUrl =  environment.apiUrl;

  constructor() {
  }

  async getImages(query: string, perPage: number = 10): Promise<TypeUrlsUnsplash[]> {
    const response = await fetch(
      `${this.apiUrl}/unsplash?query=${encodeURIComponent(query)}&per_page=${perPage}`
    );

    const data = await response.json();
    return data.results.map((photo: any) => photo.urls); //urls :{full,regular,small,small_s3,raw,thumb}

  }
}

export interface TypeUrlsUnsplash {
  full: string;
  regular: string;
  small: string;
  small_s3: string;
  raw: string;
  thumb: string;
}