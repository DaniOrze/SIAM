import { TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { HttpClientModule } from '@angular/common/http';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
