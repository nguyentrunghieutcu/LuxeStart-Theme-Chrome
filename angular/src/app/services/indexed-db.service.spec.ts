/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IndexedDbService } from './indexed-db.service';

describe('Service: IndexedDb', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndexedDbService]
    });
  });

  it('should ...', inject([IndexedDbService], (service: IndexedDbService) => {
    expect(service).toBeTruthy();
  }));
});
