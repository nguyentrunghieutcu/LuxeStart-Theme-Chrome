import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { WeatherIconPipe } from 'src/app/pipes/weather-icon.pipe';
@Component({
  selector: 'app-weather-icon',
  standalone: true,
  imports: [CommonModule, WeatherIconPipe, LucideAngularModule  ],
  templateUrl: './weather-icon.component.html',
  styleUrls: ['./weather-icon.component.scss']
})
export class WeatherIconComponent implements OnInit {
  @Input() weatherMain: any;
  constructor() { }

  ngOnInit() {
  }
}
