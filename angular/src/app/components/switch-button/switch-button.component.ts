import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-switch-button',
  standalone: true,
  imports: [LucideAngularModule,CommonModule],
  templateUrl: './switch-button.component.html',
  styleUrls: ['./switch-button.component.css']
})
export class SwitchButtonComponent {
  @Input() isOn: boolean = false;
  @Input() type: string = 'switch';
  @Output() toggle = new EventEmitter<boolean>();

  toggleSwitch(): void {
    this.isOn = !this.isOn;
    this.toggle.emit(this.isOn);
  }
 
}
