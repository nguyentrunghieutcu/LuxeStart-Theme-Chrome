import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SoundTrack } from '../../services/sounds.service';

@Component({
  selector: 'app-spotify-player-portal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spotify-portal-player" [class.minimized]="minimized()" *ngIf="embedUrl()">
      <iframe
        #spotifyIframe
        [src]="embedUrl()"
        style="border-radius:12px"
        frameBorder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy">
      </iframe>
    </div>
  `,
  styles: [`
    .spotify-portal-player {
      position: fixed;
      bottom: 0;
      right: 0;
      width: 300px;
      height: 380px;
      z-index: 1000;
      transition: all 0.3s ease;
      
      &.minimized {
        transform: translateY(calc(100% - 80px));
      }

      iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpotifyPlayerPortalComponent {
  embedUrl = signal<SafeResourceUrl | null>(null);
  minimized = signal(false);
  private isPlayingState = signal(false);

  constructor(private sanitizer: DomSanitizer) {}

  playTrack(track: SoundTrack) {
    if (!track.externalUrl) return;

    const match = track.externalUrl.match(/playlist\/([a-zA-Z0-9]+)/);
    if (match && match[1]) {
      const playlistId = match[1];
      const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0&autoplay=1`;
      this.embedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl));
      this.isPlayingState.set(true);
    }
  }

  togglePlayPause() {
    this.isPlayingState.update(state => !state);
  }

  isPlaying(): boolean {
    return this.isPlayingState();
  }

  toggleMinimize() {
    this.minimized.update(state => !state);
  }
}