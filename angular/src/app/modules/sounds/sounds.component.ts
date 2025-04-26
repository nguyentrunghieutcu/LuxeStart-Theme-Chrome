import { Component, ChangeDetectionStrategy, inject, signal, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoundsService, SoundTrack } from '../../services/sounds.service';
import { CustomOverlayComponent } from 'src/app/components/popover-overlay/popover-overlay.component';
import { fuseAnimations } from 'src/@luxstart/animations';
import { SoundsMiniPlayerComponent } from './sounds-mini-player.component';
import { SpotifyPlayerComponent } from './spotify-player.component';
import { LucideAngularModule } from 'lucide-angular';

type SoundTab = 'recent' | 'soundscapes' | 'spotify' | 'youtube';

@Component({
  selector: 'app-sounds',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    CustomOverlayComponent,
    SoundsMiniPlayerComponent,
    SpotifyPlayerComponent
  ],
  templateUrl: './sounds.component.html',
  styleUrls: ['./sounds.component.scss'],
  animations: [fuseAnimations],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoundsComponent {
  private soundsService = inject(SoundsService);
  private cd = inject(ChangeDetectorRef);

  activeTab = signal<SoundTab>('recent');
  tracks = signal<SoundTrack[]>([]);
  showSpotifyPlayer = signal<boolean>(false);
  selectedSpotifyTrack = signal<SoundTrack | null>(null);

  // Expose service signals
  currentTrack = this.soundsService.currentTrack;
  isPlaying = this.soundsService.isPlaying;

  constructor() {
    this.loadTracks('recent');

    // Check if current track is a Spotify track and show player
    const currentTrack = this.currentTrack();
    if (currentTrack && currentTrack.source === 'spotify') {
      this.selectedSpotifyTrack.set(currentTrack);
      this.showSpotifyPlayer.set(true);
    }
  }

  setActiveTab(tab: SoundTab) {
    this.activeTab.set(tab);
    this.loadTracks(tab);
  }
 
  private loadTracks(tab: SoundTab) {
    switch (tab) {
      case 'recent':
        this.tracks.set(this.soundsService.getRecentTracks());
        break;
      case 'soundscapes':
        this.tracks.set(this.soundsService.getSoundscapes());
        break;
      case 'spotify':
        this.tracks.set(this.soundsService.getSpotifyPlaylists());
        break;
      case 'youtube':
        this.tracks.set(this.soundsService.getYouTubePlaylists());
        break;
    }
  }

  playTrack(track: SoundTrack) {
    if (track.source === 'spotify') {
      // For Spotify tracks, show the embedded player
      this.selectedSpotifyTrack.set(track);
      this.showSpotifyPlayer.set(true);
    } else {
      // For other tracks, use the regular playback
      this.soundsService.playTrack(track);
      // Enable mini player when playing a track
      this.soundsService.showMiniPlayer.set(true);
      // Reload recent tracks if we're on that tab
      if (this.activeTab() === 'recent') {
        this.loadTracks('recent');
      }
    }
    this.cd.markForCheck();
  }

  closeSpotifyPlayer() {
    this.showSpotifyPlayer.set(false);
    // Don't reset the selected track or stop playback
    // Just show the mini player
    this.soundsService.showMiniPlayer.set(true);
  }

  togglePlayPause() {
    this.soundsService.togglePlayPause();
  }

  getSourceIcon(source: string): string {
    switch (source) {
      case 'spotify':
        return 'assets/sounds/spotify-icon.svg';
      case 'youtube':
        return 'assets/sounds/youtube-icon.svg';
      case 'soundscape':
      default:
        return 'assets/sounds/soundscape-icon.svg';
    }
  }
}
