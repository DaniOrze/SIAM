import { TestBed } from '@angular/core/testing';

import { AdherenceService } from './adherence.service';
import { HttpClientModule } from '@angular/common/http';

describe('AdherenceService', () => {
  let service: AdherenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(AdherenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
