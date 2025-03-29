import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, HostListener, Signal, ViewChild, ViewEncapsulation, computed, effect, inject, signal } from '@angular/core';
import { Subscription, interval, BehaviorSubject } from 'rxjs';
import { AppClockComponent } from 'src/app/components/app-clock/app-clock.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { Backgrounds } from './tab.model';
import { CurrentWeatherComponent } from 'src/app/components/current-weather/current-weather.component';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { CircleProgressComponent, CircleProgressOptions, NgCircleProgressModule } from 'ng-circle-progress';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TodosComponent } from '../todos/todos.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { PopupOverlayComponent } from 'src/app/components/popup-overlay/popup-overlay.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { SettingsComponent } from '../settings/settings.component';
import { WeatherIconPipe } from 'src/app/pipes/weather-icon.pipe';
import { BackgroundSelectionService } from 'src/app/services/background-selection.service';
import { fuseAnimations } from 'src/@luxstart/animations';
import { MantraService } from 'src/app/services/mantra.service';
import { CommonModule } from '@angular/common';
import { CustomOverlayComponent } from 'src/app/components/popover-overlay/popover-overlay.component';
import { SettingsStateService } from 'src/app/services/settings.service';
import { ZodiacComponent } from '../settings/zodiac/zodiac.component';
import { ZodiacWidgetComponent } from './widgets/zodiac-widget.component';

@Component({
  selector: 'app-tab',
  standalone: true,
  providers: [{
    provide: CircleProgressOptions, useValue: {
      percent: 85,
      radius: 60,
      showBackground: false,
      outerStrokeWidth: 10,
      innerStrokeWidth: 5,
      startFromZero: false,
      outerStrokeColor: null,
      showSubtitle: false,
    }
  }],
  animations: [fuseAnimations],
  imports: [
    PopupOverlayComponent, TodosComponent, MatSidenavModule,
    NgCircleProgressModule, MatButtonModule, DragDropModule, OverlayModule,
    MatMenuModule, CommonModule, FormsModule, AppClockComponent, FooterComponent, CurrentWeatherComponent,
    CustomOverlayComponent, SettingsComponent, ZodiacWidgetComponent
  ],
  templateUrl: 'tab.component.html',
  styleUrls: ['tab.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabComponent {
  public currentTime: string;
  private timeSubscription: Subscription;
  public mantra: string;
  public isLoading$ = new BehaviorSubject<boolean>(false);
  public show: boolean = false;
  public isDialogOpen: boolean = true;
  public backgrounds = Backgrounds;
  public useAIMantra = signal(true);
  @ViewChild('circleProgress') circleProgress: CircleProgressComponent;

  readonly dialog = inject(MatDialog);

  name = signal('Hieu');
  options = new CircleProgressOptions();

  _timer = null;
  private _timeInterval: any = null;
  private _mantraInterval: any = null;

  isEditing = signal(false);
  showPromo = signal(false);
  private localStorageService = inject(LocalStorageService);
  private backgroundService = inject(BackgroundSelectionService);
  private mantraService = inject(MantraService);

  selectedBackground = computed(() => this.backgroundService.selectedBackground());

  private lastMantraUpdate = 0;
  private readonly MANTRA_COOLDOWN = 5 * 60 * 1000; // 5 minutes in milliseconds
  private cachedMantra: string | null = null;
  settingsStateService = inject(SettingsStateService);

  constructor(private cdr: ChangeDetectorRef) {
    effect(() => {
      const userName = this.localStorageService.getItem<string>('user');
      this.name.set(userName || 'Hieu');
      this.cdr.markForCheck();
    }, {
      allowSignalWrites: true,
    });
  }

  @ViewChild('drawer') drawer: MatDrawer;
  isDrawerOpen = false;
  @ViewChild(PopupOverlayComponent) popup!: PopupOverlayComponent;

  async ngOnInit() {
    this.loadData();

    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.startUpdatingTime();
        this.cdr.markForCheck();
      } else {
        this.stopUpdatingTime();
      }
    });
  }

  async loadData() {
    this.isLoading$.next(true);
    // Load background first and wait for it to complete
    await this.backgroundService.loadStoredBackground();

    // Pre-load the background image
    const bgUrl = this.selectedBackground()['url'];
    await this.preloadImage(bgUrl);

    // Start other initializations
    this.startUpdatingTime();

    // Show content
    this.show = true;
    this.cdr.markForCheck();
    this.isLoading$.next(false);
  }

  // Helper method to preload image
  private preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src = url;
    });
  }

  showPopup(event: MouseEvent): void {
    this.popup.openPopup(event, null);
  }

  closePopup(): void {
    // this.popup.closePopup();
  }

  ngOnDestroy(): void {
    this.stopUpdatingTime();
    this.isDrawerOpen = false;

    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  start = () => {
    if (this._timer !== null) {
      clearInterval(this._timer);
    }
    this._timer = window.setInterval(() => {
      this.options.percent = (Math.round(Math.random() * 100));
    }, 1000);
  }

  stop = () => {
    if (this._timer !== null) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  enableEditing() {
    this.isEditing.set(true);
  }

  disableEditing() {
    this.isEditing.set(false);
  }

  updateName(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.name.set(inputElement.value);
    this.localStorageService.setItem('user', inputElement.value);
  }

  startUpdatingTime(): void {
    if (!this._timeInterval) {
      this.updateTime(); // Update time immediately
      this._timeInterval = setInterval(() => {
        this.updateTime();
      }, 1000);
    }

    // Initialize mantra on start
    this.updateBackground();

    // Setup mantra interval only if using AI mode
    this.setupMantraInterval();
  }

  stopUpdatingTime(): void {
    if (this._timeInterval) {
      clearInterval(this._timeInterval);
      this._timeInterval = null;
    }
    if (this._mantraInterval) {
      clearInterval(this._mantraInterval);
      this._mantraInterval = null;
    }
  }

  setupMantraInterval(): void {
    // Clear existing interval if any
    if (this._mantraInterval) {
      clearInterval(this._mantraInterval);
      this._mantraInterval = null;
    }

    // Only set up interval if AI mode is enabled
    if (this.useAIMantra()) {
      this._mantraInterval = setInterval(() => {
        this.updateBackground();
      }, 5 * 60 * 1000); // Update every 5 minutes
    }
  }

  updateBackground(): void {
    const now = new Date();
    const hours = now.getHours();

    if (!this.useAIMantra()) {
      if (hours >= 5 && hours < 12) {
        this.mantra = 'Chào Buổi Sáng';
      } else if (hours >= 12 && hours < 20) {
        this.mantra = 'Chào Buổi Chiều';
      } else {
        this.mantra = 'Chào Buổi Tối';
      }
      this.cdr.markForCheck();
      return;
    }

    // Kiểm tra xem có selectedMantraId không
    if (this.localStorageService.getItem('selectedMantra') !== null) {
      this.mantraService.getMantraObjects().then(mantras => {
        const selectedMantra = mantras.find(m => m.id === this.localStorageService.getItem('selectedMantra'));
        this.mantra = selectedMantra ? selectedMantra.text : 'No selected mantra';
        this.cdr.markForCheck();
      });
      return;
    }
    // Check if we should update the mantra based on cooldown
    const currentTime = Date.now();
    if (this.cachedMantra && currentTime - this.lastMantraUpdate < this.MANTRA_COOLDOWN) {
      this.mantra = this.cachedMantra;
      this.cdr.markForCheck();
      return;
    }

    this.mantraService.getRandomMantra().then(mantra => {
      this.mantra = mantra;
      if (this.mantra === 'No mantras available') {
        if (hours >= 5 && hours < 12) {
          this.mantra = 'Chào Buổi Sáng';
        } else if (hours >= 12 && hours < 20) {
          this.mantra = 'Chào Buổi Chiều';
        } else {
          this.mantra = 'Chào Buổi Tối';
        }
      } else {
        // Cache the successful mantra response
        this.cachedMantra = this.mantra;
        this.lastMantraUpdate = currentTime;
      }
      this.cdr.markForCheck();
    });
  }

  updateTime(): void {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}:${seconds}`;
  }

  // New method to check if greeting is from DB
  isMantraFromDB(): boolean {
    return this.mantra !== 'Chào Buổi Sáng' && this.mantra !== 'Chào Buổi Chiều' && this.mantra !== 'Chào Buổi Tối';
  }

  toggleMantraMode(): void {
    this.useAIMantra.set(!this.useAIMantra());
    // Reset cache when toggling mode
    this.cachedMantra = null;
    this.lastMantraUpdate = 0;
    // Update mantra immediately and setup new interval
    this.updateBackground();
    this.setupMantraInterval();
  }
}
