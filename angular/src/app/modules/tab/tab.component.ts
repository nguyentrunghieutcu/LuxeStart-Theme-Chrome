import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, HostBinding, Signal, ViewChild, ViewEncapsulation, effect, inject, signal } from '@angular/core'
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
import { PipComponent } from 'src/app/components/pip/pip.component';

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
  imports: [FlowComponent,
    NgCircleProgressModule, MatButtonModule,DragDropModule,
    RouterLink, RouterOutlet, NgOptimizedImage, CommonModule, FormsModule, AppClockComponent, FooterComponent, CurrentWeatherComponent,

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
  selectedBackground: any;
  public backgrounds = Backgrounds;
  @ViewChild('circleProgress') circleProgress: CircleProgressComponent;

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

  isEditing = signal(false);
  showPromo = signal(false);
  private localStorageService = inject(LocalStorageService);

  constructor() {
    effect(() => {
      const userName = this.localStorageService.getItem<string>('user');
      this.name.set(userName || 'Hieu');
    }, {
      allowSignalWrites: true, // Enable writing to signals inside this effect
    });

    
  }
  
  ngOnInit(): void {
    this.updateBackground();
    this.updateTime();
    this.loadBackgroundBasedOnTime();

    setTimeout(() => {
      this.isLoading = false;
    }, 100);
    setInterval(() => this.updateTime(), 1000); // Update the time every second 
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

  ngOnDestroy(): void {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
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

  loadBackgroundBasedOnTime(): void {
    const currentHour = new Date().getHours();

    let selectedRange;

    // Define time ranges for morning, noon, afternoon, evening
    if (currentHour >= 5 && currentHour < 12) {
      selectedRange = 'morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      selectedRange = 'afternoon';
    } else if (currentHour >= 17 && currentHour < 20) {
      selectedRange = 'evening';
    } else {
      selectedRange = 'night';
    }

    // Randomly select a background based on the time range
    const backgroundsForTime = this.getBackgroundsForTime(selectedRange);
    if (backgroundsForTime.length > 0) {
      const randomIndex = Math.floor(Math.random() * backgroundsForTime.length);
      this.selectedBackground = backgroundsForTime[randomIndex].url;  // Select randomly
    }
  }

  getBackgroundsForTime(time: string) {
    // You can customize logic for different times of the day. For now, just return all backgrounds.
    // You can group images by time or filter based on different logic.
    return this.backgrounds.filter(background => background.time === time);
  }

  updateTime(): void {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}:${seconds}`;
  }

  
}
