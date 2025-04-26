import { Injectable, inject, signal } from '@angular/core';
import { LocalStorageService } from './storage/local-storage.service';
import { SpotifyWebPlaybackService } from './spotify-web-playback.service';

export interface SoundTrack {
  id: string;
  title: string;
  source: 'spotify' | 'youtube' | 'soundscape' | 'custom';
  imageUrl: string;
  audioUrl?: string;
  externalUrl?: string;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SoundsService {
  private readonly LAST_PLAYED_KEY = 'lastPlayedSound';
  private readonly VOLUME_KEY = 'soundVolume';
  private _localStorage = inject(LocalStorageService);

  // State signals
  currentTrack = signal<SoundTrack | null>(null);
  isPlaying = signal<boolean>(false);
  volume = signal<number>(80);
  showMiniPlayer = signal<boolean>(false);
  spotifyPlayerVisible = signal<boolean>(false);

  // Audio elements
  private audioElement: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;

  // Track collections
  recentTracks = signal<SoundTrack[]>([]);

  constructor( ) {
    this.initAudio();
    this.loadSavedState();
  }

  private initAudio() {
    // Initialize Web Audio API
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error('Web Audio API is not supported in this browser', e);
    }

    // Also initialize regular audio element as fallback
    this.audioElement = new Audio();

    // Set up event listeners
    this.audioElement.addEventListener('ended', () => {
      this.isPlaying.set(false);
    });

    // Load saved volume
    const savedVolume = this._localStorage.getItem<number>(this.VOLUME_KEY);
    if (savedVolume !== null) {
      this.volume.set(savedVolume);
      if (this.audioElement) {
        this.audioElement.volume = savedVolume / 100;
      }
    }
  }

  private loadSavedState() {
    // Try to load a Spotify track first
    const spotifyTracks = this.getSpotifyPlaylists();
    if (spotifyTracks.length > 0) {
      // Set the first Spotify track as current
      this.currentTrack.set(spotifyTracks[0]);
      // Add to recent tracks
      this.recentTracks.set([spotifyTracks[0]]);
    } else {
      // Fall back to last played track if no Spotify tracks
      const lastPlayed = this._localStorage.getItem<SoundTrack>(this.LAST_PLAYED_KEY);
      if (lastPlayed) {
        this.currentTrack.set(lastPlayed);
        // Don't autoplay, just load the track
        this.loadTrack(lastPlayed, false);
      }
    }
  }

  getSoundscapes(): SoundTrack[] {
    return [
      {
        id: 'ocean',
        title: 'Ocean',
        source: 'soundscape',
        imageUrl: 'assets/sounds/ocean.svg',
        audioUrl: 'assets/sounds/ocean.mp3',
        category: 'Nature'
      },
      {
        id: 'rainfall',
        title: 'Rainfall',
        source: 'soundscape',
        imageUrl: 'assets/sounds/rainfall.svg',
        audioUrl: 'assets/sounds/rain.mp3',
        category: 'Nature'
      },
      {
        id: 'atmospheric',
        title: 'Atmospheric Focus',
        source: 'soundscape',
        imageUrl: 'assets/sounds/atmospheric.svg',
        audioUrl: 'assets/sounds/atmospheric.mp3',
        category: 'Focus'
      }
    ];
  }

  getSpotifyPlaylists(): SoundTrack[] {
    // Move the lofi hip hop radio to the top so it's selected by default
    return [
      {
        id: 'lofi-hip-hop',
        title: 'lofi hip hop radio',
        source: 'spotify',
        imageUrl: 'https://i.pinimg.com/736x/1d/95/e2/1d95e2e030c9acc3e664c5e849662416.jpg',
        externalUrl: 'https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM',
        category: 'Focus'
      },
      {
        id: 'beats-to-think-to',
        title: 'Beats to think to',
        source: 'spotify',
        imageUrl: 'https://i.pinimg.com/736x/ed/34/64/ed3464ee7ea4a1a95fc3cf5d995e59d0.jpg',
        externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZZbwlv3Vmtr',
        category: 'Focus'
      },
      {
        id: 'mellow-beats',
        title: 'Mellow Beats',
        source: 'spotify',
        imageUrl: 'https://i.pinimg.com/736x/ff/79/c6/ff79c60c089d85ec9cf1758524aee5ae.jpg',
        externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX3PFzdbtx1Us',
        category: 'Chill'
      },
      {
        id: 'lush-lofi',
        title: 'lush lofi',
        source: 'spotify',
        imageUrl: 'https://i.pinimg.com/736x/97/b5/a5/97b5a5761fc690f46fe94b092032b0ec.jpg',
        externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXc8kgYqQLMfH',
        category: 'Chill'
      },
      {
        id: 'jazz-in-the-background',
        title: 'Jazz in the Background',
        source: 'spotify',
        imageUrl: 'https://i.pinimg.com/736x/3d/8c/5c/3d8c5c90ad484c1c1cc684e7b87edb1b.jpg',
        externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWV7EzJMK2FUI',
        category: 'Jazz'
      },
      {
        id: 'piano-in-the-background',
        title: 'Piano in the Background',
        source: 'spotify',
        imageUrl: 'https://i.pinimg.com/736x/50/65/d6/5065d66c9d1bf610aebfda8431cd069f.jpg',
        externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX7K31D69s4M1',
        category: 'Classical'
      }
    ];
  }

  getYouTubePlaylists(): SoundTrack[] {
    return [
      {
        id: 'new-york-coffee-shop',
        title: 'New York Coffee Shop',
        source: 'youtube',
        imageUrl: 'https://i.pinimg.com/736x/33/6f/0e/336f0e5bb192d0f4556cc360f0775b6d.jpg',
        externalUrl: 'https://www.youtube.com/watch?v=BOdLmxy06H0',
        category: 'Ambience'
      },
      {
        id: 'study-with-me',
        title: 'Study With Me',
        source: 'youtube',
        imageUrl: 'https://i.pinimg.com/736x/32/25/60/322560366e4e447c280de2398e78dbc7.jpg',
        externalUrl: 'https://www.youtube.com/watch?v=1ex_bNIFR1A',
        category: 'Focus'
      }
    ];
  }

  getAllTracks(): SoundTrack[] {
    return [
      ...this.getSoundscapes(),
      ...this.getSpotifyPlaylists(),
      ...this.getYouTubePlaylists()
    ];
  }

  getRecentTracks(): SoundTrack[] {
    return this.recentTracks();
  }

  async playTrack(track: SoundTrack, autoplay = true) {
    if (track.source === 'spotify') {
      // Set the current track
      this.currentTrack.set(track);
      this.isPlaying.set(true);
      
      // The mini player will automatically pick up the change
      // through the effects we set up
      return;
    }

    // For other tracks, load and play the audio
    this.loadTrack(track, autoplay);

    // Add to recent tracks if not already there
    const recents = this.recentTracks();
    const existingIndex = recents.findIndex(t => t.id === track.id);

    if (existingIndex !== -1) {
      // Remove from current position
      recents.splice(existingIndex, 1);
    }

    // Add to the beginning
    recents.unshift(track);

    // Keep only the last 5 tracks
    if (recents.length > 5) {
      recents.pop();
    }

    this.recentTracks.set([...recents]);
    this._localStorage.setItem(this.LAST_PLAYED_KEY, track);
  }

  private loadTrack(track: SoundTrack, autoplay: boolean) {
    this.currentTrack.set(track);

    // Stop any currently playing audio
    this.stopAudio();

    if (track.source === 'soundscape') {
      if (this.audioContext) {
        // Use Web Audio API to generate sounds
        this.playGeneratedSound(track.id);
        if (autoplay) {
          this.isPlaying.set(true);
        }
      } else {
        // Fallback to regular audio element if Web Audio API is not available
        console.warn('Web Audio API not available, using fallback');
        this.playFallbackAudio(track, autoplay);
      }
    } else if (track.source === 'spotify' && track.externalUrl) {
      // For Spotify, we'll open in a new window or use an embedded player
      window.open(track.externalUrl, '_blank');
    } else if (track.source === 'youtube' && track.externalUrl) {
      // For YouTube, we'll open in a new window or use an embedded player
      window.open(track.externalUrl, '_blank');
    }
  }

  private playGeneratedSound(soundId: string) {
    if (!this.audioContext) return;

    // Stop any existing oscillator
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }

    // Create new oscillator and gain node
    this.oscillator = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();

    // Configure based on the sound type
    switch (soundId) {
      case 'ocean':
        this.oscillator.type = 'sine';
        this.oscillator.frequency.value = 100; // Low frequency for ocean waves
        this.gainNode.gain.value = this.volume() / 200; // Lower volume for ocean
        break;
      case 'rainfall':
        this.oscillator.type = 'sine'; // Use sine wave for rainfall
        this.oscillator.frequency.value = 300; // Medium frequency for rainfall
        this.gainNode.gain.value = this.volume() / 300; // Even lower volume for rainfall
        break;
      case 'thunderstorm':
        this.oscillator.type = 'sawtooth';
        this.oscillator.frequency.value = 80; // Very low frequency for thunder
        this.gainNode.gain.value = this.volume() / 150; // Louder for thunder
        break;
      case 'atmospheric':
        this.oscillator.type = 'sine';
        this.oscillator.frequency.value = 250; // Medium-high frequency for atmospheric
        this.gainNode.gain.value = this.volume() / 250; // Medium volume
        break;
      default:
        this.oscillator.type = 'sine';
        this.oscillator.frequency.value = 200;
        this.gainNode.gain.value = this.volume() / 200;
    }

    // Connect nodes
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    // Start oscillator
    this.oscillator.start();
  }

  private playFallbackAudio(track: SoundTrack, autoplay: boolean) {
    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.addEventListener('ended', () => {
        this.isPlaying.set(false);
      });
    }

    // Create a simple beep sound as fallback
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Configure based on the sound type
    switch (track.id) {
      case 'ocean':
        oscillator.frequency.value = 100;
        break;
      case 'rainfall':
        oscillator.frequency.value = 300;
        break;
      case 'thunderstorm':
        oscillator.frequency.value = 80;
        break;
      case 'atmospheric':
        oscillator.frequency.value = 250;
        break;
      default:
        oscillator.frequency.value = 200;
    }

    gainNode.gain.value = this.volume() / 200;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (autoplay) {
      oscillator.start();
      this.isPlaying.set(true);

      // Stop after 10 seconds
      setTimeout(() => {
        oscillator.stop();
        if (track.id === this.currentTrack()?.id) {
          this.isPlaying.set(false);
        }
      }, 10000);
    }
  }

  stopAudio() {
    // Stop Web Audio API sound
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch (e) {
        // Ignore errors if oscillator is already stopped
      }
      this.oscillator = null;
    }

    // Stop regular audio element
    if (this.audioElement && this.audioElement.src) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
  }

  togglePlayPause() {
    const track = this.currentTrack();
    if (!track) return;

    if (this.isPlaying()) {
      this.isPlaying.set(false);
    } else {
      this.isPlaying.set(true);
    }
  }

  setVolume(value: number) {
    this.volume.set(value);
    this._localStorage.setItem(this.VOLUME_KEY, value);

    const track = this.currentTrack();
    if (track?.source === 'spotify') {
      const spotifyService = inject(SpotifyWebPlaybackService);
      spotifyService.setVolume(value);
      return;
    }

    // Update audio element volume if it exists
    if (this.audioElement) {
      this.audioElement.volume = value / 100;
    }

    // Update gain node volume if it exists
    if (this.gainNode) {
      // Different sounds have different volume scaling
      const track = this.currentTrack();
      if (track) {
        switch (track.id) {
          case 'rainfall':
            this.gainNode.gain.value = value / 300;
            break;
          case 'thunderstorm':
            this.gainNode.gain.value = value / 150;
            break;
          case 'atmospheric':
            this.gainNode.gain.value = value / 250;
            break;
          default:
            this.gainNode.gain.value = value / 200;
        }
      } else {
        this.gainNode.gain.value = value / 200;
      }
    }
  }

  stop() {
    if (!this.audioElement) return;

    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.isPlaying.set(false);
  }
}
