import { NgModule } from '@angular/core';
import { WeatherIconComponent } from './weather-icon.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CloudLightning, CloudDrizzle, CloudRain, CloudSnow, CloudSun,Cloud, Cloudy, Tornado, CloudFog, Wind, AlarmSmoke } from 'lucide-angular';
import { WeatherIconPipe } from 'src/app/pipes/weather-icon.pipe';
export const WEATHER_ICONS = {
    Thunderstorm: CloudLightning,
    Drizzle: CloudDrizzle,
    Rain: CloudRain,
    Snow: CloudSnow,
    Clear: CloudSun,
    Clouds: Cloud, // Sửa lại từ 'Cloudy' -> 'Cloud'
    Tornado: Tornado,
    Mist: CloudFog,
    Smoke: AlarmSmoke,
    Haze: CloudFog,
    Dust: Wind,
    Fog: CloudFog,
    Sand: Wind,
    Ash: Wind,
    Squall: Wind,
};
 
@NgModule({
    imports: [
        CommonModule,
        LucideAngularModule.pick(WEATHER_ICONS),
        WeatherIconPipe],
    exports: [WeatherIconComponent],
    declarations: [WeatherIconComponent],
    providers: [],
})
export class WeatherIconModule { }
