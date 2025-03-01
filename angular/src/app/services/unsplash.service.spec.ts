/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UnsplashService } from './unsplash.service';

describe('Service: Unsplash', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnsplashService]
    });
  });

  it('should ...', inject([UnsplashService], (service: UnsplashService) => {
    expect(service).toBeTruthy();
  }));
});
