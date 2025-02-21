import { ApplicationConfig, EnvironmentProviders, InjectionToken, Provider, importProvidersFrom, provideExperimentalZonelessChangeDetection } from '@angular/core'
import { provideRouter, withHashLocation } from '@angular/router'

import { routes } from './app.routes'
import { provideHttpClient } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { FUSE_CONFIG } from 'src/@luxstart/config/config.constants';
import { FuseConfig } from 'src/@luxstart/config';

export type FuseProviderConfig = {
  fuse?: FuseConfig
}

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
          scheme: 'light',
          theme: 'theme-default',
        }
      }),
      provideHttpClient(),
      provideExperimentalZonelessChangeDetection(),
      provideRouter(routes, withHashLocation()),
      provideAnimations(),
      importProvidersFrom([BrowserModule, BrowserAnimationsModule])
    ]
  }
}
