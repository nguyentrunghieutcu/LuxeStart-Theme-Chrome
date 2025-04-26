import { ChangeDetectorRef, Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SettingsStateService } from 'src/app/services/settings.service';
import { CommonModule } from '@angular/common';
import { FuseConfig, Scheme, Themes } from 'src/@luxstart/config/config.types';
import { DarkModeService } from 'src/app/services/darkmode.service';
import { FuseConfigService } from 'src/@luxstart/config/config.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SwitchButtonComponent } from 'src/app/components/switch-button/switch-button.component';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [MatSlideToggleModule, CommonModule, SwitchButtonComponent ],
  templateUrl: './general.component.html'
})
export class GeneralComponent {
  darkMode: boolean;
  config: FuseConfig;
  layout: string;
  scheme: 'dark' | 'light';
  theme: string;
  themes: Themes;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(public settingsStateService: SettingsStateService,

    private darkModeService: DarkModeService,
    private _fuseConfigService: FuseConfigService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this._fuseConfigService.config$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: FuseConfig) => {
        this.config = config;
      });
    const darkModeSetting = localStorage.getItem('dark-mode');
    if (darkModeSetting !== null) {
      this.darkMode = JSON.parse(darkModeSetting).mode === 'dark';  
      this.cd.markForCheck();
    }
  }


  /**
   * Set the scheme on the config
   *
   * @param scheme
   */
  setScheme(scheme: Scheme): void {
    this._fuseConfigService.config = { scheme };
    this.cd.markForCheck();
  }
  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    this.darkModeService.toggleDarkMode(this.darkMode);
    this.cd.markForCheck();

  }
}
