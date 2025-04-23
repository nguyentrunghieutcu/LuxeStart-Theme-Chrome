import { Injectable, ComponentRef, ApplicationRef, createComponent, EmbeddedViewRef, Injector } from '@angular/core';
import { SoundTrack } from './sounds.service';
import { SpotifyPlayerPortalComponent } from '../components/spotify-player-portal/spotify-player-portal.component';

@Injectable({
  providedIn: 'root'
})
export class SpotifyPlayerService {
  private playerRef: ComponentRef<SpotifyPlayerPortalComponent> | null = null;
  private currentTrack: SoundTrack | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  play(track: SoundTrack) {
    this.currentTrack = track;
    
    if (!this.playerRef) {
      // Create player component if it doesn't exist
      this.createPlayer();
    }
    
    // Update player with new track
    if (this.playerRef) {
      this.playerRef.instance.playTrack(track);
    }
  }

  private createPlayer() {
    // Create player component
    this.playerRef = createComponent(SpotifyPlayerPortalComponent, {
      environmentInjector: this.appRef.injector,
      elementInjector: this.injector
    });

    // Get DOM element
    const domElem = (this.playerRef.hostView as EmbeddedViewRef<any>).rootNodes[0];

    // Add to body
    document.body.appendChild(domElem);

    // Attach to application
    this.appRef.attachView(this.playerRef.hostView);
  }

  getCurrentTrack(): SoundTrack | null {
    return this.currentTrack;
  }

  isPlaying(): boolean {
    return this.playerRef?.instance.isPlaying() ?? false;
  }

  togglePlayPause() {
    this.playerRef?.instance.togglePlayPause();
  }

  destroy() {
    if (this.playerRef) {
      this.appRef.detachView(this.playerRef.hostView);
      this.playerRef.destroy();
      this.playerRef = null;
    }
  }
}