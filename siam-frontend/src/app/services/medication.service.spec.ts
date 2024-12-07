import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MedicationService } from './medication.service';
import { Medication } from '../models/medication.model';

describe('MedicationService', () => {
  let service: MedicationService;
  let httpMock: HttpTestingController;

  const mockMedication: Medication = {
    name: 'Aspirin',
    dosage: 100,
    startdate: '2024-12-01',
    administrationschedules: [
      { time: '08:00', daysOfWeek: ['Monday', 'Wednesday', 'Friday'] },
    ],
  };

  const mockMedications: Medication[] = [
    {
      id: 1,
      name: 'Aspirin',
      dosage: 100,
      startdate: '2024-12-01',
      administrationschedules: [
        { time: '08:00', daysOfWeek: ['Monday', 'Wednesday', 'Friday'] },
      ],
    },
    {
      id: 2,
      name: 'Paracetamol',
      dosage: 500,
      startdate: '2024-12-02',
      administrationschedules: [
        { time: '10:00', daysOfWeek: ['Tuesday', 'Thursday'] },
      ],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MedicationService],
    });

    service = TestBed.inject(MedicationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a medication', () => {
    service.addMedication(mockMedication).subscribe((response) => {
      expect(response).toEqual(mockMedication);
    });

    const req = httpMock.expectOne(
      'http://localhost:3000/medication/new-medications'
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockMedication);
  });

  it('should get all medications', () => {
    service.getMedicamentos().subscribe((response) => {
      expect(response).toEqual(mockMedications);
    });

    const req = httpMock.expectOne(
      'http://localhost:3000/medication/get-medications'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockMedications);
  });

  it('should edit a medication', () => {
    const updatedMedication: Medication = { ...mockMedication, id: 1 };
    service.editMedication(updatedMedication).subscribe((response) => {
      expect(response).toEqual(updatedMedication);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/medication/edit-medications/${updatedMedication.id}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush(updatedMedication);
  });

  it('should get a medication by id', () => {
    const medicationId = '1';
    service.getMedicationById(medicationId).subscribe((response) => {
      expect(response).toEqual(mockMedications[0]);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/medication/get-medication/${medicationId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockMedications[0]);
  });

  it('should handle error', () => {
    const errorMessage = 'Something went wrong; please try again later.';

    service.getMedicamentos().subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error) => {
        expect(error).toEqual(errorMessage);
      },
    });

    const req = httpMock.expectOne(
      'http://localhost:3000/medication/get-medications'
    );
    expect(req.request.method).toBe('GET');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
