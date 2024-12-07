import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AlertService } from './alert.service';
import { Alert } from '../models/alert.model';

describe('AlertService', () => {
  let service: AlertService;
  let httpMock: HttpTestingController;

  const mockAlert: Alert = {
    id: 1,
    name: 'Test Alert',
    playCount: 3,
    isActive: true,
    medicationname: 'Test Medication',
  };

  const mockAlerts: Alert[] = [
    { id: 1, name: 'Test Alert 1', playCount: 2, isActive: true },
    { id: 2, name: 'Test Alert 2', playCount: 4, isActive: false },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AlertService],
    });
    service = TestBed.inject(AlertService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add an alert', () => {
    service.addAlert(mockAlert).subscribe((response) => {
      expect(response).toEqual(mockAlert);
    });

    const req = httpMock.expectOne('http://localhost:3000/alert/new-alerts');
    expect(req.request.method).toBe('POST');
    req.flush(mockAlert);
  });

  it('should get all alerts', () => {
    service.getAlerts().subscribe((response) => {
      expect(response).toEqual(mockAlerts);
    });

    const req = httpMock.expectOne('http://localhost:3000/alert/get-alerts');
    expect(req.request.method).toBe('GET');
    req.flush(mockAlerts);
  });

  it('should edit an alert', () => {
    const updatedAlert: Alert = { ...mockAlert, name: 'Updated Alert' };

    service.editAlert(updatedAlert).subscribe((response) => {
      expect(response).toEqual(updatedAlert);
    });

    const req = httpMock.expectOne('http://localhost:3000/alert/edit-alerts/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedAlert);
  });

  it('should get an alert by id', () => {
    service.getAlertById('1').subscribe((response) => {
      expect(response).toEqual(mockAlert);
    });

    const req = httpMock.expectOne('http://localhost:3000/alert/get-alert/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockAlert);
  });

  it('should handle error correctly', () => {
    const errorMessage = 'Something went wrong; please try again later.';

    service.getAlerts().subscribe({
      next: () => fail('should have failed with 500 status'),
      error: (error: string) => {
        expect(error).toBe(errorMessage);
      },
    });

    const req = httpMock.expectOne('http://localhost:3000/alert/get-alerts');
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
