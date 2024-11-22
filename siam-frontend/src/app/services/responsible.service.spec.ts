import { TestBed } from '@angular/core/testing';

import { ResponsibleService } from './responsible.service';
import { HttpClientModule } from '@angular/common/http';

describe('ResponsibleService', () => {
  let service: ResponsibleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(ResponsibleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
