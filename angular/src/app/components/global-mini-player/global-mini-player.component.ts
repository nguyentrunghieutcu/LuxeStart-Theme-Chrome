import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { SoundsService } from '../../services/sounds.service';
import { LucideAngularModule } from 'lucide-angular';
import { SpotifyPlayerService } from '../../services/spotify-player.service';

@Component({
  selector: 'app-global-mini-player',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, MatSliderModule],
  template: `
    <div class="global-mini-player" *ngIf="currentTrack() && showPlayer()">
      <div class="track-info">
        <img [src]="currentTrack()?.imageUrl" [alt]="currentTrack()?.title">
        <div class="track-title">{{ currentTrack()?.title }}</div>
      </div>

      <div class="controls">
        <button class="control-button" (click)="togglePlayPause()">
          <lucide-icon [name]="isPlaying() ? 'pause' : 'play'" class="icon-size-5"></lucide-icon>
        </button>

        <button class="control-button" (click)="closePlayer()">
          <lucide-icon name="x" class="icon-size-5"></lucide-icon>
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
    .global-mini-player {
      position: fixed;
      top: 20px;
      left: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(10px);
      border-radius: 8px;
      padding: 8px 12px;
      z-index: 1000;
      width: 280px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
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
export class GlobalMiniPlayerComponent {
  private soundsService = inject(SoundsService);
  private spotifyPlayerService = inject(SpotifyPlayerService);

  currentTrack = computed(() => {
    const track = this.soundsService.currentTrack();
    return track?.source === 'spotify' 
      ? this.spotifyPlayerService.getCurrentTrack() 
      : track;
  });

  isPlaying = computed(() => {
    const track = this.soundsService.currentTrack();
    return track?.source === 'spotify'
      ? this.spotifyPlayerService.isPlaying()
      : this.soundsService.isPlaying();
  });

  volume = this.soundsService.volume;
  showPlayer = this.soundsService.showMiniPlayer;

  togglePlayPause() {
    const track = this.currentTrack();
    if (track?.source === 'spotify') {
      this.spotifyPlayerService.togglePlayPause();
    } else {
      this.soundsService.togglePlayPause();
    }
  }

  closePlayer() {
    const track = this.currentTrack();
    if (track?.source === 'spotify') {
      this.spotifyPlayerService.destroy(); // Use existing destroy() method
    }
    this.soundsService.showMiniPlayer.set(false);
    this.soundsService.isPlaying.set(false);
    this.soundsService.stopAudio();
    this.soundsService.currentTrack.set(null);
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
