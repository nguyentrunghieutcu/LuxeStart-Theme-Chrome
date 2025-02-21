import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core'
import { effect } from '@angular/core'
import { merge, Observable } from 'rxjs'
import { ICurrentWeather, WeatherService } from 'src/app/services/weather.service'
import { WeatherIconModule } from '../weather-icon/weather-icon.module'

@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [CommonModule, WeatherIconModule],
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentWeatherComponent {
  usingSignal = true
  current: ICurrentWeather | null = null
  current$: Observable<ICurrentWeather>
  currentCity: string;
  constructor(
    private weatherService: WeatherService,
    private cdr: ChangeDetectorRef
  ) {
    effect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.weatherService.getCityByCoords(position.coords.latitude, position.coords.longitude).subscribe((data) => {
            this.currentCity = data.address.city || data.address.town || data.address.village || 'Unknown location';
            this.current$ = this.weatherService.getCurrentWeatherByCoords({ longitude: position.coords.longitude, latitude: position.coords.latitude })
            this.cdr.markForCheck()

          });
        }, () => { })
      } else {
        console.log("Geolocation is not supported by this browser.")
      }
    })

  }

  // Attribution: https://stackoverflow.com/a/44418732/178620
  getOrdinal(date: number) {
    const n = new Date(date).getDate()
    return n > 0
      ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : ''
  }

}
