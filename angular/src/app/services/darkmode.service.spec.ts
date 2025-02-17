/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DarkmodeService } from './darkmode.service';

describe('Service: Darkmode', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DarkmodeService]
    });
  });

  it('should ...', inject([DarkmodeService], (service: DarkmodeService) => {
    expect(service).toBeTruthy();
  }));
});
