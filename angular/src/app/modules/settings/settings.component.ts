import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, OnInit, ViewChild, effect, signal, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { PhotosComponent } from './photos/photos.component';
 
import { GreetingsComponent } from './greetings/greetings.component';
import { MantrasComponent } from './mantras/mantras.component';
import { GeneralComponent } from './general/general.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    FormsModule,
    PhotosComponent,
    LucideAngularModule,
    MatListModule,
    MatSidenavModule,
    GreetingsComponent,
    MantrasComponent,
    GeneralComponent
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  tabs: { id: string; name: string }[] = [{ id: 'general', name: 'Chung' }, { id: 'photos', name: 'Ảnh' }];
  selectedTab: number = 0;
  selectedTabGeneral: number = 0;

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  selectTab(index: number): void {
    this.selectedTab = index;
    this.cd.markForCheck();
  }

  changeTab(index: number): void {
    this.selectedTabGeneral = index;
    this.cd.markForCheck();
  }

  keepMenuOpen(event: Event) {
    event.stopPropagation();
  }


}
