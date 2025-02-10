import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';

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
    <div class="popup"
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
  styleUrls: ['./popup-overlay.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PopupOverlayComponent {
  @Input() isVisible = false;
  @Input() popupData: any = null;
  @Input() maxHeight: number | null = null; // Tùy chọn giới hạn chiều cao

  popupStyle = {
    top: 'auto',
    left: 'auto',
  };

  constructor(private elementRef: ElementRef) { }

  openPopup(event: MouseEvent, data?: any): void {
    const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const popupWidth = 300; // Chiều rộng popup giả định
    const popupHeight = this.maxHeight || 150; // Chiều cao tối đa popup (dựa vào maxHeight hoặc mặc định 150px)

    let top = buttonRect.top - popupHeight;
    let left = buttonRect.left;

    // Kiểm tra nếu popup vượt quá trên màn hình, điều chỉnh lại
    if (top < 0) {
      top = buttonRect.bottom; // Đưa popup xuống dưới nút
    }

    // Kiểm tra nếu popup vượt quá dưới màn hình, điều chỉnh lại
    if (top + popupHeight > viewportHeight) {
      top = viewportHeight - popupHeight - 10; // Đặt popup gần đáy màn hình
    }

    // Điều chỉnh lại left nếu popup vượt quá bên phải màn hình
    if (left + popupWidth > viewportWidth) {
      left = viewportWidth - popupWidth - 10;
    }

    // Điều chỉnh lại left nếu popup vượt quá bên trái màn hình
    if (left < 0) {
      left = 10;
    }

    // Cập nhật vị trí của popup
    this.popupStyle = {
      top: `${top + window.scrollY}px`, // Cộng thêm scrollY nếu có
      left: `${left + window.scrollX}px`, // Cộng thêm scrollX nếu có
    };

    this.popupData = data || null;
    this.isVisible = true;
  }


  closePopup(): void {
    this.isVisible = false;
  }
}
