/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SplashscreenService } from './splashscreen.service';

describe('Service: Splashscreen', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SplashscreenService]
    });
  });

  it('should ...', inject([SplashscreenService], (service: SplashscreenService) => {
    expect(service).toBeTruthy();
  }));
});
