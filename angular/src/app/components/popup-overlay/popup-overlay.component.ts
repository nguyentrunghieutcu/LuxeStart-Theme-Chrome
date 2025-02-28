import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewEncapsulation, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-popup-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div
    class="popup-overlay"
    *ngIf="isVisible"
    [ngStyle]="popupStyle"
  >
    <div #popup class="popup"
      [ngStyle]="{ 'max-height': maxHeight ? maxHeight + 'px' : 'auto',
        'overflow-y': maxHeight ? 'auto' : 'visible' }"
    >
       <ng-container *ngIf="popupData">
        <h2>{{ popupData.title }}</h2>
        <p>{{ popupData.message }}</p>
      </ng-container>
      <ng-content></ng-content>
    </div>
  </div>
`,
  styleUrls: ['./popup-overlay.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopupOverlayComponent {
  @Input() isVisible = false;
  @Input() popupData: any = null;
  @Input() maxHeight: number | null = null;

  @ViewChild('popup') popup!: ElementRef;

  popupStyle = {
    top: 'auto',
    left: 'auto',
  };

  constructor(private elementRef: ElementRef) { }

  openPopup(event: MouseEvent, data?: any): void {
    const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const popupWidth = 300;
    const popupHeight = this.maxHeight || 150;

    let top = buttonRect.top - popupHeight;
    let left = buttonRect.left;

    if (top < 0) {
      top = buttonRect.bottom;
    }

    if (top + popupHeight > viewportHeight) {
      top = viewportHeight - popupHeight - 10;
    }

    if (left + popupWidth > viewportWidth) {
      left = viewportWidth - popupWidth - 10;
    }

    if (left < 0) {
      left = 10;
    }

    this.popupStyle = {
      top: `${top + window.scrollY}px`,
      left: `${left + window.scrollX}px`,
    };

    this.popupData = data || null;
    this.isVisible = true;
    
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.popup?.nativeElement || !this.elementRef?.nativeElement) {
      return;
    }
    const clickedInsidePopup = this.popup.nativeElement.contains(event.target);
    const clickedInsideOverlay = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInsidePopup && !clickedInsideOverlay) {
      this.closePopup();
    }
  }

  closePopup(): void {
    this.isVisible = false;
  }
}
