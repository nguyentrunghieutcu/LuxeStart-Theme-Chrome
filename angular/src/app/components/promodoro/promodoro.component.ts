import { Component, OnInit, Signal, signal, effect, ViewEncapsulation } from '@angular/core';
import { CircleProgressOptions, NgCircleProgressModule } from 'ng-circle-progress';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { fuseAnimations } from 'src/@luxstart/animations';

@Component({
  selector: 'app-promodoro',
  standalone: true,
  providers: [{
    provide: CircleProgressOptions, useValue: {
      "backgroundOpacity": "0",
      "radius": 300,
      "space": -10,
      "toFixed": "0",
      "maxPercent": "100",
      "outerStrokeColor": "#b0b0b0",
      "outerStrokeGradientStopColor": "#53a9ff",
      "innerStrokeColor": "#e6e8ea",
      "innerStrokeWidth": 10,
      "title": "UI",
      "animateTitle": false,
      "animationDuration": 10000,
      "showTitle": false,
      "showSubtitle": false,
      "showUnits": false,
      "showBackground": false,
      "responsive": false,
      "showZeroOuterStroke": false,
      "lazy": false
    }
  }
  ],
  animations: [fuseAnimations],
  imports: [NgCircleProgressModule, CommonModule, MatButtonModule],
  templateUrl: './promodoro.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./promodoro.component.scss']
})
export class PromodoroComponent {
  focusTime = signal<number>(25); // Mặc định 25 phút cho Focus
  shortBreakTime = signal<number>(5); // Mặc định 5 phút cho Short Break
  longBreakTime = signal<number>(15); // Mặc định 15 phút cho Long Break

  currentTime = signal<number>(this.focusTime() * 60); // Thời gian hiện tại (giây)
  progressPercent = signal<number>(0); // Tiến trình phần trăm
  statusText = signal<string>('Focus'); // Trạng thái hiện tại
  outerStrokeColor = signal<string>('#78C000');
  innerStrokeColor = signal<string>('#C7E596');

  roundCount: number = 0;
  interval: any;
  isRunning = signal<boolean>(false); // Trạng thái của bộ đếm (đang chạy hay không)

  constructor() {
    effect(() => {
      this.currentTime.set(this.focusTime() * 60); // Cập nhật thời gian đếm ngược ban đầu
    }, { allowSignalWrites: true });
  }
  updateFocusTime(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.focusTime.set(Number(value));
  }

  updateShortBreakTime(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.shortBreakTime.set(Number(value));
  }

  updateLongBreakTime(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.longBreakTime.set(Number(value));
  }

  // Khởi động hoặc tạm dừng Pomodoro
  toggleTimer() {
    if (this.isRunning()) {
      this.pauseTimer();
    } else {
      this.startPomodoro();
    }
  }

  // Bắt đầu Pomodoro
  startPomodoro() {
    this.isRunning.set(true); // Đặt trạng thái thành đang chạy
    this.runTimer();
  }

  // Tạm dừng Pomodoro
  pauseTimer() {
    this.isRunning.set(false); // Đặt trạng thái thành không chạy
    clearInterval(this.interval); // Dừng bộ đếm thời gian
  }

  runTimer() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      const timeLeft = this.currentTime() - 1;
      this.currentTime.set(timeLeft);
      this.progressPercent.set(((this.focusTime() * 60 - timeLeft) / (this.focusTime() * 60)) * 100);

      if (this.currentTime() <= 0) {
        this.switchMode();
      }
    }, 1000);
  }

  switchMode() {
    if (this.statusText() === 'Focus') {
      this.roundCount++;
      if (this.roundCount >= 4) {
        this.startLongBreak();
      } else {
        this.startShortBreak();
      }
    } else {
      this.startFocus();
    }
  }

  startFocus() {
    this.statusText.set('Focus');
    this.currentTime.set(this.focusTime() * 60);
    this.progressPercent.set(0);
    this.outerStrokeColor.set('#78C000');
    this.innerStrokeColor.set('#C7E596');
    this.runTimer();
  }

  startShortBreak() {
    this.statusText.set('Short Break');
    this.currentTime.set(this.shortBreakTime() * 60);
    this.progressPercent.set(0);
    this.outerStrokeColor.set('#007AFF');
    this.innerStrokeColor.set('#87CEEB');
    this.runTimer();
  }

  startLongBreak() {
    this.statusText.set('Long Break');
    this.currentTime.set(this.longBreakTime() * 60);
    this.progressPercent.set(0);
    this.outerStrokeColor.set('#FF6347');
    this.innerStrokeColor.set('#FFB6C1');
    this.runTimer();
    this.roundCount = 0;
  }

  resetPomodoro() {
    clearInterval(this.interval);
    this.currentTime.set(this.focusTime() * 60);
    this.progressPercent.set(0);
    this.statusText.set('Focus');
  }

  // Hàm định dạng thời gian từ giây thành 'mm:ss'
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
