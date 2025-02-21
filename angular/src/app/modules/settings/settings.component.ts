import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, OnInit, ViewChild, effect, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { DarkModeService } from 'src/app/services/darkmode.service';
import { LucideAngularModule } from 'lucide-angular';
import { PhotosComponent } from './photos/photos.component';
import { FuseConfig, Scheme, Theme, Themes } from 'src/@luxstart/config/config.types';
import { FuseConfigService } from 'src/@luxstart/config/config.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, FormsModule, PhotosComponent,
    LucideAngularModule,
    MatListModule, MatSidenavModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings = {
    showLinks: true,
    showSearch: true,
    darkMode: false,
    transparentBg: false,
    showWeather: true,
    enableTasks: false
  };
  tabs: string[] = ['General', 'Photos'];
  selectedTab: number = 0;
  darkMode: boolean;
  config: FuseConfig;
  layout: string;
  scheme: 'dark' | 'light';
  theme: string;
  themes: Themes;

  @Input() settingsMenu: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private darkModeService: DarkModeService,
    private _fuseConfigService: FuseConfigService,
  ) {

  }

  ngOnInit() {
    // Subscribe to config changes
    this._fuseConfigService.config$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: FuseConfig) => {
        // Store the config
        this.config = config;
        this.darkMode = this.darkModeService.isDarkMode();
      });
  }

  /**
      * Set the scheme on the config
      *
      * @param scheme
      */
  setScheme(scheme: Scheme): void {
    this._fuseConfigService.config = { scheme };
  }

  selectTab(index: number): void {
    this.selectedTab = index;
  }

  keepMenuOpen(event: Event) {
    event.stopPropagation();
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode
    this.darkModeService.toggleDarkMode(this.darkMode )
  }
}
