import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SoundTrack, SoundsService } from '../../services/sounds.service';

@Component({
  selector: 'app-spotify-player',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="spotify-player" *ngIf="track">
      <div class="player-header">
        <div class="back-button" (click)="goBack.emit()">
          <lucide-icon name="chevron-left" class="icon-size-5"></lucide-icon>
        </div>
        <div class="track-info">
          <span class="track-title">{{ track.title }}</span>
        </div>
        <div class="spotify-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1DB954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </div>
      </div>

      <div class="player-content">
        <div class="spotify-embed-container" *ngIf="embedUrl">
          <iframe
            #spotifyIframe
            [src]="embedUrl"
            style="border-radius:12px"
            frameBorder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            (load)="onIframeLoad()">
          </iframe>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .spotify-player {
      width: 100%;
      height: 100%;
      background-color: #121212;
      color: white;
      display: flex;
      flex-direction: column;
    }

    .player-header {
      display: flex;
      align-items: center;
      padding: 16px;
      background-color: rgba(0, 0, 0, 0.3);
    }

    .back-button {
      cursor: pointer;
      margin-right: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.7);
    }

    .track-info {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .track-title {
      font-size: 16px;
      font-weight: 600;
    }

    .spotify-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1DB954;
    }

    .player-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      padding: 16px;
    }

    .spotify-embed-container {
      width: 100%;
      height: calc(100% - 32px);
      margin-top: 16px;

      iframe {
        width: 100%;
        height: 100%;
        min-height: 352px;
      }
    }

    .spotify-iframe {
      display: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpotifyPlayerComponent implements OnChanges, OnDestroy {
  @Input() track: SoundTrack | null = null;
  @Output() goBack = new EventEmitter<void>();
  @ViewChild('spotifyIframe') spotifyIframe!: ElementRef<HTMLIFrameElement>;

  embedUrl: SafeResourceUrl | null = null;
  // No need for subscription with signals

  constructor(
    private sanitizer: DomSanitizer,
    private soundsService: SoundsService
  ) {
    // Create an effect to watch isPlaying changes
    effect(() => {
      const isPlaying = this.soundsService.isPlaying();
      this.controlSpotifyPlayer(isPlaying);
    });
  }

  ngOnInit() {
    // Mark the main player as visible
    this.soundsService.spotifyPlayerVisible.set(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['track'] && this.track) {
      this.updateEmbedUrl();
    }
  }

  ngAfterViewInit(): void {
    // Initialize the iframe if needed
  }

  ngOnDestroy() {
    // Mark the main player as hidden when destroyed
    this.soundsService.spotifyPlayerVisible.set(false);
  }

  onIframeLoad(): void {
    
  }

  private controlSpotifyPlayer(isPlaying: boolean): void {
    // Try to control the Spotify player through postMessage
    if (this.spotifyIframe?.nativeElement?.contentWindow) {
      try {
        const message = isPlaying ? 'play' : 'pause';
        this.spotifyIframe.nativeElement.contentWindow.postMessage(
          { command: message },
          'https://open.spotify.com'
        );
      } catch (error) {
        console.error('Error controlling Spotify player:', error);
      }
    }
  }

  private updateEmbedUrl(): void {
    if (!this.track || !this.track.externalUrl) return;

    // Extract Spotify playlist ID from the URL
    const match = this.track.externalUrl.match(/playlist\/([a-zA-Z0-9]+)/);
    if (match && match[1]) {
      const playlistId = match[1];
      const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0&autoplay=1`;
      this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
  }
}
