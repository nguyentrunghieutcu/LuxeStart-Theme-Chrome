import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { SoundTrack } from './sounds.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyWebPlaybackService {
  private player: any = null;
  private deviceId: string | null = null;
  private readonly CLIENT_ID = ''; // Replace with your Spotify Client ID
  
  isReady = signal(false);
  isPlaying = signal(false);
  currentTrack = signal<SoundTrack | null>(null);

  async initializePlayer(token: string) {
    if (!(window as any).Spotify) {
      console.error('Spotify SDK not loaded');
      return;
    }

    this.player = new (window as any).Spotify.Player({
      name: 'LuxeStart Web Player',
      getOAuthToken: cb => { cb(token); },
      volume: 0.5
    });

    // Error handling
    this.player.addListener('initialization_error', ({ message }) => {
      console.error('Failed to initialize', message);
    });

    this.player.addListener('authentication_error', ({ message }) => {
      console.error('Failed to authenticate', message);
    });

    this.player.addListener('account_error', ({ message }) => {
      console.error('Failed to validate Spotify account', message);
    });

    this.player.addListener('playback_error', ({ message }) => {
      console.error('Failed to perform playback', message);
    });

    // Playback status updates
    this.player.addListener('player_state_changed', (state: any) => {
      if (state) {
        this.isPlaying.set(!state.paused);
      }
    });

    // Ready
    this.player.addListener('ready', ({ device_id }) => {
      this.deviceId = device_id;
      this.isReady.set(true);
    });

    // Connect to the player
    await this.player.connect();
  }

  async playTrack(track: SoundTrack) {
    if (!this.isReady() || !this.deviceId) {
      console.error('Player not ready');
      return;
    }

    const playlistId = this.extractPlaylistId(track.externalUrl);
    if (!playlistId) return;

    try {
      // Start playback using Spotify Connect API
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({
          context_uri: `spotify:playlist:${playlistId}`,
          position_ms: 0
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAccessToken()}`
        }
      });

      this.currentTrack.set(track);
      this.isPlaying.set(true);
    } catch (error) {
      console.error('Failed to start playback', error);
    }
  }

  async togglePlayPause() {
    if (!this.player) return;
    await this.player.togglePlay();
    this.isPlaying.update(state => !state);
  }

  async setVolume(value: number) {
    if (!this.player) return;
    await this.player.setVolume(value / 100);
  }

  private extractPlaylistId(url: string): string | null {
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }

  private getAccessToken(): string {
    // Implement your token management logic here
    // You might want to store this in a secure way and refresh when needed
    return 'your_spotify_access_token';
  }

  disconnect() {
    if (this.player) {
      this.player.disconnect();
      this.player = null;
      this.deviceId = null;
      this.isReady.set(false);
      this.isPlaying.set(false);
      this.currentTrack.set(null);
    }
  }
}
