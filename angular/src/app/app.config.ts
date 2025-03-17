import { ApplicationConfig, ENVIRONMENT_INITIALIZER, EnvironmentProviders, InjectionToken, Provider, importProvidersFrom, inject, provideExperimentalZonelessChangeDetection } from '@angular/core'
import { provideRouter, withHashLocation } from '@angular/router'

import { routes } from './app.routes'
import { provideHttpClient } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { FUSE_CONFIG } from 'src/@luxstart/config/config.constants';
import { FuseConfig } from 'src/@luxstart/config';
import {
  LogIn, SunMoon, CloudLightning, CloudDrizzle, Edit, MessageSquare,
  CloudRain, CloudSnow, CloudSun, Cloud, Cloudy, Tornado, CloudFog, Wind, AlarmSmoke, Plus, Loader, Trash2, X, Check,
  Quote, Sparkles, Clock, RefreshCcw, Pin
} from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { FuseSplashScreenService } from './services/splashscreen.service';

export type FuseProviderConfig = {
  fuse?: FuseConfig
}
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
  SunMoon: SunMoon,
  LogIn: LogIn,
  Check: Check,
  X: X,
  Trash2: Trash2,
  Loader: Loader,
  Plus: Plus,
  Edit: Edit,
  MessageSquare: MessageSquare,
  Quote: Quote,
  Sparkles: Sparkles,
  Clock: Clock,
  RefreshCcw: RefreshCcw,
  Pin: Pin
};

/**
 * Fuse provider
 */
export const provideFuse = (config: FuseProviderConfig): Array<Provider | EnvironmentProviders> => {
  // Base providers
  const providers: Array<Provider | EnvironmentProviders> = [
    {
      provide: FUSE_CONFIG,
      useValue: config?.fuse ?? {},
    },
    {
      provide : ENVIRONMENT_INITIALIZER,
      useValue: () => inject(FuseSplashScreenService),
      multi   : true,
  },
  ];
  // Return the providers
  return providers;
};

export const TAB_ID = new InjectionToken<number>('CHROME_TAB_ID')

export const appConfig = (tabId: number): ApplicationConfig => {
  return {
    providers: [
      { provide: TAB_ID, useValue: tabId },
      provideFuse({
        fuse: {
          scheme: 'dark'
        }
      }),


      provideHttpClient(),
      provideExperimentalZonelessChangeDetection(),
      provideRouter(routes, withHashLocation()),
      provideAnimations(),
      importProvidersFrom([BrowserModule, BrowserAnimationsModule, LucideAngularModule.pick(WEATHER_ICONS),])
    ]
  }
}
