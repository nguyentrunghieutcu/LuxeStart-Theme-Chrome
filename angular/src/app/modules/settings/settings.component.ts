import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, OnInit, ViewChild, effect, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { DarkModeService } from 'src/app/services/darkmode.service';
import { LucideAngularModule } from 'lucide-angular';
import { PhotosComponent } from './photos/photos.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, FormsModule, PhotosComponent,
    LucideAngularModule,
    MatListModule, MatSidenavModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
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

  @Input() settingsMenu: any;
  constructor(private darkModeService: DarkModeService) {
    effect(() => {
      window.localStorage.setItem('darkMode', JSON.stringify(this.darkModeSig()));
    });
  }

  ngOnInit() {
  }

  darkModeSig = signal<boolean>(
    !window.localStorage.getItem('dark-mode')? true : JSON.parse(window.localStorage.getItem('dark-mode'))['mode'] == 'dark' ? true : false
  );

  @HostBinding('class.dark') get mode() {
    return this.darkModeSig();
  }


  selectTab(index: number): void {
    this.selectedTab = index;
  }

  keepMenuOpen(event: Event) {
    event.stopPropagation();
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode
    this.darkModeService.toggleDarkMode(this.darkMode);
  }
}
