import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, HostListener, ElementRef, Output, EventEmitter } from "@angular/core";
import { Subscription, timer } from "rxjs";
import { map, share } from "rxjs/operators";
import { FormsModule } from '@angular/forms';
import { PromodoroComponent } from "../promodoro/promodoro.component";
import { fuseAnimations } from "src/@luxstart/animations";

@Component({
  selector: 'app-clock',
  animations:[fuseAnimations],
  imports: [DatePipe, CommonModule, FormsModule, PromodoroComponent],
  standalone: true,
  templateUrl: './app-clock.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppClockComponent implements OnInit, OnDestroy {
  time = new Date();
  rxTime: Date = new Date();
  subscription: Subscription = new Subscription();
  show: boolean = true;
  showClock: boolean = true;
  @Output() valueChanged = new EventEmitter<any>();
  constructor(private cdr: ChangeDetectorRef, private elementRef: ElementRef) { }

  
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

  openMenu() {
    this.show = true;
    this.cdr.markForCheck()
  }

  valueChange() {
    this.show = !this.show;
    this.showClock = !this.showClock;
    this.valueChanged.emit(  this.show)
    this.cdr.markForCheck()
  }

}
