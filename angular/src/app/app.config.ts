import { ApplicationConfig, InjectionToken, provideExperimentalZonelessChangeDetection } from '@angular/core'
import { provideRouter, withHashLocation } from '@angular/router'

import { routes } from './app.routes'
import { provideHttpClient } from '@angular/common/http'

export const TAB_ID = new InjectionToken<number>('CHROME_TAB_ID')

export const appConfig = (tabId: number): ApplicationConfig => {
  return {
    providers: [
      { provide: TAB_ID, useValue: tabId },
      provideHttpClient(),
      provideExperimentalZonelessChangeDetection(),
      provideRouter(routes, withHashLocation())
    ]
  }
}
