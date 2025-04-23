import { Component, ChangeDetectionStrategy, inject, ViewChild, ElementRef, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { SoundsService } from '../../services/sounds.service';
import { LucideAngularModule } from 'lucide-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sounds-mini-player',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, MatSliderModule],
  template: `
    <div class="mini-player" *ngIf="currentTrack()">
      <div class="track-info">
        <img [src]="currentTrack()?.imageUrl" [alt]="currentTrack()?.title">
        <div class="track-title">{{ currentTrack()?.title }}</div>
      </div>
      
      <!-- Hidden Spotify iframe for background playback -->
      <div class="hidden-spotify-player" *ngIf="currentTrack()?.source === 'spotify' && embedUrl()">
        <iframe
          #miniSpotifyIframe
          [src]="embedUrl()"
          style="display: none"
          frameBorder="0"
          allowfullscreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy">
        </iframe>
      </div>

      <div class="controls">
        <button class="control-button" (click)="togglePlayPause()">
          <lucide-icon [name]="isPlaying() ? 'pause' : 'play'" class="icon-size-5"></lucide-icon>
        </button>

        <mat-slider
          class="volume-slider"
          [min]="0"
          [max]="100"
          [step]="1"
          [discrete]="true"
          [showTickMarks]="false"
          [displayWith]="formatLabel"
          (change)="setVolume($event)">
          <input matSliderThumb [value]="volume()">
        </mat-slider>
      </div>
    </div>
  `,
  styles: [`
    .mini-player {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
      border-radius: 8px;
      padding: 8px 12px;
      margin-bottom: 8px;
    }

    .track-info {
      display: flex;
      align-items: center;
      gap: 8px;

      img {
        width: 32px;
        height: 32px;
        border-radius: 4px;
        object-fit: cover;
      }

      .track-title {
        font-size: 14px;
        color: white;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 120px;
      }
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .control-button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
      }

      lucide-icon {
        color: white;
      }
    }

    .volume-slider {
      width: 80px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoundsMiniPlayerComponent {
  private soundsService = inject(SoundsService);
  private sanitizer = inject(DomSanitizer);
  
  @ViewChild('miniSpotifyIframe') miniSpotifyIframe!: ElementRef<HTMLIFrameElement>;

  currentTrack = this.soundsService.currentTrack;
  isPlaying = this.soundsService.isPlaying;
  volume = this.soundsService.volume;
  embedUrl = signal<SafeResourceUrl | null>(null);

  constructor() {
    effect(() => {
      const track = this.currentTrack();
      if (track?.source === 'spotify' && track.externalUrl) {
        this.updateEmbedUrl(track.externalUrl);
      }
    });

    effect(() => {
      const isPlaying = this.isPlaying();
      this.controlSpotifyPlayer(isPlaying);
    });
  }

  private updateEmbedUrl(externalUrl: string): void {
    const match = externalUrl.match(/playlist\/([a-zA-Z0-9]+)/);
    if (match && match[1]) {
      const playlistId = match[1];
      const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0&autoplay=1`;
      this.embedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl));
      
    }
  }

  private controlSpotifyPlayer(isPlaying: boolean): void {
    if (this.miniSpotifyIframe?.nativeElement?.contentWindow) {
      try {
        const message = isPlaying ? 'play' : 'pause';
        this.miniSpotifyIframe.nativeElement.contentWindow.postMessage(
          { command: message },
          'https://open.spotify.com'
        );
      } catch (error) {
        console.error('Error controlling mini Spotify player:', error);
      }
    }
  }

  togglePlayPause() {
    this.soundsService.togglePlayPause();
  }

  setVolume(event: any) {
    const value = event.value;
    if (typeof value === 'number') {
      this.soundsService.setVolume(value);
    }
  }

  formatLabel(value: number): string {
    return `${value}%`;
  }
}
