import { AfterViewInit, Component, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
  
@Component({
  selector: 'app-custom-overlay',
  standalone: true,
  imports: [OverlayModule,CommonModule  ],
  template: `
    <ng-template #overlayContent>
      <ng-content></ng-content>
    </ng-template>
  `,
  styles: []
})
export class CustomOverlayComponent implements AfterViewInit {
  @ViewChild('overlayContent') private overlayContent!: TemplateRef<any>;
  private overlayRef!: OverlayRef;

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) { }
  
  ngAfterViewInit() {
    // Now it's safe to use this.overlayContent and this.viewContainerRef
  }

  openOverlay(origin: HTMLElement) {
    if (this.overlayRef) {
      this.closeOverlay();
    }

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(origin)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY:-46,
          offsetX: -26
        }
      ]);

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: 'cdk-overlay-pane'
    });

    const portal = new TemplatePortal(this.overlayContent, this.viewContainerRef);
    this.overlayRef.attach(portal);
    this.overlayRef.backdropClick().subscribe(() => this.closeOverlay());
  }

  closeOverlay() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined!;
    }
  }
}
