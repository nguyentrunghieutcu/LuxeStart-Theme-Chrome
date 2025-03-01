import { Pipe, PipeTransform } from '@angular/core';
import { WEATHER_ICONS } from '../app.config';
 
@Pipe({
  name: 'weatherIcon',
  standalone: true,
})
export class WeatherIconPipe implements PipeTransform {
  transform(value: string): any {
    return WEATHER_ICONS[value] || 'Cloud'; // Default là 'Cloud' nếu không tìm thấy
  }
}
