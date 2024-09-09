import { DatePipe } from "@angular/common";
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Subscription, timer } from "rxjs";
import { map, share } from "rxjs/operators";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clock',
  imports: [DatePipe, FormsModule],
  standalone: true,
  templateUrl: './app-clock.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppClockComponent implements OnInit, OnDestroy {
  time = new Date();
  rxTime: Date = new Date();
  subscription: Subscription = new Subscription();
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Using RxJS Timer
    this.subscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      )
      .subscribe(time => {
        this.rxTime = time;
        this.cdr.detectChanges()
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
