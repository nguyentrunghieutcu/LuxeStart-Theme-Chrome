import { AfterViewInit, Component, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

@Component({
  selector: 'app-custom-overlay',
  standalone: true,
  imports: [OverlayModule, CommonModule],
  template: `
    <ng-template #overlayContent>
      <ng-content></ng-content>
    </ng-template>
  `,
  styleUrls: ['./popover-overlay.component.scss']
})
export class CustomOverlayComponent implements AfterViewInit {
  @Input() placement: PopoverPlacement = 'bottom';
  @Input() offset = 8;
  @ViewChild('overlayContent') private overlayContent!: TemplateRef<any>;
  private overlayRef!: OverlayRef;

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) { }

  ngAfterViewInit() {}

  private getPositions(placement: PopoverPlacement) {
    const positions: any[] = [];
    
    switch (placement) {
      case 'top':
        positions.push(
          { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -this.offset },
          { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: this.offset }
        );
        break;
      case 'bottom':
        positions.push(
          { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: this.offset },
          { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -this.offset }
        );
        break;
      case 'left':
        positions.push(
          { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -this.offset },
          { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: this.offset }
        );
        break;
      case 'right':
        positions.push(
          { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: this.offset },
          { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -this.offset }
        );
        break;
    }
    
    return positions;
  }

  openOverlay(origin: HTMLElement) {
    if (this.overlayRef) {
      this.closeOverlay();
    }

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(origin)
      .withPositions(this.getPositions(this.placement))
      .withPush(true);

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: ['cdk-overlay-pane', 'popover-panel', `popover-${this.placement}`]
    });

    const portal = new TemplatePortal(this.overlayContent, this.viewContainerRef);
    this.overlayRef.attach(portal);

    // Handle position changes to update arrow
    positionStrategy.positionChanges.subscribe(position => {
      const placement = this.getPlacementFromPosition(position.connectionPair);
      this.updateArrowPlacement(placement);
    });

    this.overlayRef.backdropClick().subscribe(() => this.closeOverlay());
    this.overlayRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        this.closeOverlay();
      }
    });
  }

  private getPlacementFromPosition(position: any): PopoverPlacement {
    if (position.originY === 'top') return 'bottom';
    if (position.originY === 'bottom') return 'top';
    if (position.originX === 'start') return 'right';
    return 'left';
  }

  private updateArrowPlacement(placement: PopoverPlacement) {
    const element = this.overlayRef.overlayElement;
    element.setAttribute('data-popper-placement', placement);
  }

  closeOverlay() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined!;
    }
  }
}
