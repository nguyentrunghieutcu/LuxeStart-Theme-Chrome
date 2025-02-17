import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { signal } from '@angular/core'
import { WritableSignal } from '@angular/core'
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs'
import { first, map, switchMap } from 'rxjs/operators'

import { environment } from '../../environments/environment'
import { PostalCodeService, defaultPostalCode } from './post-code.service'
export interface ICurrentWeather {
  city: string
  country: string
  date: number
  image: string
  temperature: number
  description: string
  main: string
}
export interface ICurrentWeatherData {
  weather: [
    {
      description: string
      icon: string,
      main:string
    },
  ]
  main: {
    temp: number
  }
  sys: {
    country: string
  }
  dt: number
  name: string
}

export const defaultWeather: ICurrentWeather = {
  city: '--',
  country: '--',
  date: Date.now(),
  image: '',
  temperature: 0,
  description: '',
  main: ''
}

export interface IWeatherService {
  readonly currentWeather$: BehaviorSubject<ICurrentWeather>
  getCurrentWeather(city: string, country?: string): Observable<ICurrentWeather>
  getCurrentWeatherByCoords(coords: GeolocationCoordinates): Observable<ICurrentWeather>
  updateCurrentWeather(searchText: string, country?: string): void
  updateCurrentWeatherSignal(searchText: string, country?: string): void
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService implements IWeatherService {
  readonly currentWeather$ = new BehaviorSubject<ICurrentWeather>(defaultWeather)
  readonly currentWeatherSignal = signal(defaultWeather)
  readonly reactivityMode: WritableSignal<'signal' | 'subject' | 'ngrx'> =
    signal('subject')
  private nominatimUrl = 'https://nominatim.openstreetmap.org/reverse';

  constructor(
    private httpClient: HttpClient,
    private postalCodeService: PostalCodeService
  ) { }

  getCurrentWeatherByCoords(coords: {
    latitude: number
    longitude: number
  }): Observable<ICurrentWeather> {
    const uriParams = new HttpParams()
      .set('lat', coords.latitude.toString())
      .set('lon', coords.longitude.toString())

    return this.getCurrentWeatherHelper(uriParams)
  }

  updateCurrentWeather(searchText: string, country?: string): void {
    this.getCurrentWeather(searchText, country)
      .pipe(first())
      .subscribe((weather) => this.currentWeather$.next(weather))
  }

  async updateCurrentWeatherSignal(searchText: string, country?: string): Promise<void> {
    this.currentWeatherSignal.set(
      await this.getCurrentWeatherAsPromise(searchText, country)
    )
  }

  getCurrentWeather(searchText: string, country?: string): Observable<ICurrentWeather> {
    return this.postalCodeService.resolvePostalCode(searchText).pipe(
      switchMap((postalCode) => {
        if (postalCode && postalCode !== defaultPostalCode) {
          return this.getCurrentWeatherByCoords({
            latitude: postalCode.lat,
            longitude: postalCode.lng,
          })
        } else {
          const uriParams = new HttpParams().set(
            'q',
            country ? `${searchText},${country}` : searchText
          )

          return this.getCurrentWeatherHelper(uriParams)
        }
      })
    )
  }

  getCurrentWeatherAsPromise(
    searchText: string,
    country?: string
  ): Promise<ICurrentWeather> {
    return firstValueFrom(this.getCurrentWeather(searchText, country))
  }

  getCityByCoords(latitude: number, longitude: number): Observable<any> {
    const url = `${this.nominatimUrl}?lat=${latitude}&lon=${longitude}&format=json`;
    return this.httpClient.get(url);
  }

  private getCurrentWeatherHelper(uriParams: HttpParams): Observable<ICurrentWeather> {
    uriParams = uriParams.set('appid', environment.appId)

    return this.httpClient
      .get<ICurrentWeatherData>(
        `${environment.baseUrl}api.openweathermap.org/data/2.5/weather?lang=vi`,
        { params: uriParams }
      )
      .pipe(map((data) => this.transformToICurrentWeather(data)))
  }

  private transformToICurrentWeather(data: ICurrentWeatherData): ICurrentWeather {
    return {
      city: data.name,
      country: data.sys.country,
      date: data.dt * 1000,
      image: `${environment.baseUrl}openweathermap.org/img/w/${data.weather[0].icon}.png`,
      temperature: this.kelvinToCelsius(data.main.temp),
      description: data.weather[0].description,
      main: data.weather[0].main,
    }
  }

  private convertKelvinToFahrenheit(kelvin: number): number {
    return (kelvin * 9) / 5 - 459.67
  }

  private kelvinToCelsius(kelvin: number): number {
    return kelvin - 273.15;
  }
}