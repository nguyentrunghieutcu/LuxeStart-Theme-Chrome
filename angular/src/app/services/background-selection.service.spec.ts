/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BackgroundSelectionService } from './background-selection.service';

describe('Service: BackgroundSelection', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackgroundSelectionService]
    });
  });

  it('should ...', inject([BackgroundSelectionService], (service: BackgroundSelectionService) => {
    expect(service).toBeTruthy();
  }));
});
