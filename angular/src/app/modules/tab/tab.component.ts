import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, HostBinding, HostListener, Signal, ViewChild, ViewEncapsulation, computed, effect, inject, signal } from '@angular/core'
import { RouterLink, RouterOutlet } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { AppClockComponent } from 'src/app/components/app-clock/app-clock.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { Backgrounds } from './tab.model';
import { CurrentWeatherComponent } from 'src/app/components/current-weather/current-weather.component';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { CircleProgressComponent, CircleProgressOptions, NgCircleProgressModule } from 'ng-circle-progress';
import { PromodoroComponent } from 'src/app/components/promodoro/promodoro.component';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlowComponent } from 'src/app/components/flow/flow.component';
import { TodosComponent } from '../todos/todos.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { PopupOverlayComponent } from 'src/app/components/popup-overlay/popup-overlay.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { SettingsComponent } from '../settings/settings.component';
import { WeatherIconPipe } from 'src/app/pipes/weather-icon.pipe';
import { BackgroundSelectionService } from 'src/app/services/background-selection.service';

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
  }
  ],
  imports: [FlowComponent, PopupOverlayComponent, TodosComponent, MatSidenavModule,
    NgCircleProgressModule, MatButtonModule, DragDropModule, OverlayModule,
    RouterLink, RouterOutlet, SettingsComponent, MatMenuModule, CommonModule, FormsModule, AppClockComponent, FooterComponent, CurrentWeatherComponent,
    WeatherIconPipe
  ],
  templateUrl: 'tab.component.html',
  styleUrls: ['tab.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabComponent {
  public currentTime: string;
  private timeSubscription: Subscription;
  public greeting: string;
  public isLoading: boolean = true;
  public show: boolean = true;
  public isDialogOpen: boolean = true;
  public backgrounds = Backgrounds;
  @ViewChild('circleProgress') circleProgress: CircleProgressComponent;
  readonly dialog = inject(MatDialog);

  name = signal('Hieu');
  options = new CircleProgressOptions();

  optionsE = {
    percent: 75,
    radius: 60,
    outerStrokeWidth: 10,
    innerStrokeWidth: 10,
    space: -10,
    outerStrokeColor: "#4882c2",
    innerStrokeColor: "#e7e8ea",
    showBackground: false,
    title: 'UI',
    animateTitle: false,
    showUnits: false,
    clockwise: false,
    animationDuration: 1000,
    startFromZero: false,
    outerStrokeGradient: true,
    outerStrokeGradientStopColor: '#53a9ff',
    lazy: true,
    subtitleFormat: (percent: number): string => {
      return `${percent}%`;
    }
  }
  _timer = null;
  private _timeInterval: any = null;

  isEditing = signal(false);
  showPromo = signal(false);
  private localStorageService = inject(LocalStorageService);
  private backgroundService = inject(BackgroundSelectionService);

  selectedBackground = computed(() => this.backgroundService.selectedBackground()
  );

  constructor() {
    effect(() => {
      const userName = this.localStorageService.getItem<string>('user');
      this.name.set(userName || 'Hieu');

    }, {
      allowSignalWrites: true, // Enable writing to signals inside this effect
    });


  }
  @ViewChild('drawer') drawer: MatDrawer;
  isDrawerOpen = false;
  @ViewChild(PopupOverlayComponent) popup!: PopupOverlayComponent;
  showPopup(event: MouseEvent): void {
    this.popup.openPopup(event, null);
  }

  openDrawer(): void {
    console.log('object');
    this.isDrawerOpen = true;
    this.drawer.open();
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
    this.drawer.close();
  }

  onDrawerClosed(): void {
    console.log('Drawer closed');
  }

  ngOnInit(): void {
    this.backgroundService.loadStoredBackground()

    this.updateBackground();
    setTimeout(() => {
      this.isLoading = false;
    }, 100);
    this.startUpdatingTime();

    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.startUpdatingTime();
        this.updateBackground();

      } else {
        this.stopUpdatingTime();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopUpdatingTime();
    this.isDrawerOpen = false;

    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  valueChanged(event) {
    this.show = event
    this.showPromo.set(true)
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
      this.updateTime(); // Update ngay khi khởi động
      this.updateBackground(); // Cập nhật greeting ngay lập tức

      this._timeInterval = setInterval(() => {
        this.updateTime()
        this.updateBackground();
      }
        , 1000);
    }
  }

  stopUpdatingTime(): void {
    if (this._timeInterval) {
      clearInterval(this._timeInterval);
      this._timeInterval = null;
    }
  }

  updateBackground(): void {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 5 && hours < 12) {
      this.greeting = 'Chào Buổi Sáng'
    } else if (hours >= 12 && hours < 20) {
      this.greeting = 'Chào Buổi Chiều'
    }
    else {
      this.greeting = 'Chào Buổi Tối'
    }

  }

  updateTime(): void {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}:${seconds}`;
  }


}
