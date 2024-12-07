import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AdherenceService } from './adherence.service';
import {
  AdherenceData,
  MissedDosesByWeek,
  DailyConsumption,
} from '../models/adherence.model';

describe('AdherenceService', () => {
  let service: AdherenceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AdherenceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAdherenceData', () => {
    it('should return adherence data', () => {
      const mockAdherenceData: AdherenceData[] = [
        { name: 'Medication A', taken_count: 5, missed_count: 2 },
        { name: 'Medication B', taken_count: 7, missed_count: 0 },
      ];

      service.getAdherenceData().subscribe((data) => {
        expect(data).toEqual(mockAdherenceData);
      });

      const req = httpMock.expectOne(
        'http://localhost:3000/adherence/get-adherence-data'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockAdherenceData);
    });
  });

  describe('getMissedDosesByWeek', () => {
    it('should return missed doses data by week', () => {
      const mockMissedDoses: MissedDosesByWeek[] = [
        { name: 'Medication A', missed_count: 2, week: '2024-W01' },
        { name: 'Medication B', missed_count: 1, week: '2024-W02' },
      ];

      service.getMissedDosesByWeek().subscribe((data) => {
        expect(data).toEqual(mockMissedDoses);
      });

      const req = httpMock.expectOne(
        'http://localhost:3000/adherence/get-missed-doses-by-week'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockMissedDoses);
    });
  });

  describe('getDailyConsumption', () => {
    it('should return daily consumption data', () => {
      const mockDailyConsumption: DailyConsumption[] = [
        { name: 'Medication A', taken_count: 3, day_of_week: 'Monday' },
        { name: 'Medication B', taken_count: 4, day_of_week: 'Tuesday' },
      ];

      service.getDailyConsumption().subscribe((data) => {
        expect(data).toEqual(mockDailyConsumption);
      });

      const req = httpMock.expectOne(
        'http://localhost:3000/adherence/get-daily-consumption'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockDailyConsumption);
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
