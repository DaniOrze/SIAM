import { TestBed } from '@angular/core/testing';

import { AdherenceService } from './adherence.service';

describe('AdherenceService', () => {
  let service: AdherenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdherenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
