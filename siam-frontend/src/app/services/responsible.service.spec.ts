import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ResponsibleService } from './responsible.service';
import { Responsible } from '../models/responsible.model';

describe('ResponsibleService', () => {
  let service: ResponsibleService;
  let httpMock: HttpTestingController;

  const mockResponsible: Responsible = {
    full_name: 'John Doe',
    cpf: '12345678900',
    birthdate: '1990-01-01',
    phone_number: '1234567890',
    email: 'john.doe@example.com',
  };

  const mockResponsibles: Responsible[] = [
    {
      id: 1,
      full_name: 'John Doe',
      cpf: '12345678900',
      birthdate: '1990-01-01',
      phone_number: '1234567890',
      email: 'john.doe@example.com',
    },
    {
      id: 2,
      full_name: 'Jane Doe',
      cpf: '09876543210',
      birthdate: '1992-02-02',
      phone_number: '0987654321',
      email: 'jane.doe@example.com',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ResponsibleService],
    });

    service = TestBed.inject(ResponsibleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a responsible', () => {
    service.addResponsible(mockResponsible).subscribe((response) => {
      expect(response).toEqual(mockResponsible);
    });

    const req = httpMock.expectOne(
      'http://localhost:3000/responsible/new-responsibles'
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockResponsible);
  });

  it('should get all responsibles', () => {
    service.getResponsibles().subscribe((response) => {
      expect(response).toEqual(mockResponsibles);
    });

    const req = httpMock.expectOne(
      'http://localhost:3000/responsible/get-responsibles'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponsibles);
  });

  it('should edit a responsible', () => {
    const updatedResponsible: Responsible = { ...mockResponsible, id: 1 };
    service.editResponsible(updatedResponsible).subscribe((response) => {
      expect(response).toEqual(updatedResponsible);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/responsible/edit-responsibles/${updatedResponsible.id}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush(updatedResponsible);
  });

  it('should get a responsible by id', () => {
    const responsibleId = '1';
    service.getResponsibleById(responsibleId).subscribe((response) => {
      expect(response).toEqual(mockResponsibles[0]);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/responsible/get-responsible/${responsibleId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponsibles[0]);
  });

  it('should handle error', () => {
    const errorMessage = 'Something went wrong; please try again later.';

    service.getResponsibles().subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error) => {
        expect(error).toEqual(errorMessage);
      },
    });

    const req = httpMock.expectOne(
      'http://localhost:3000/responsible/get-responsibles'
    );
    expect(req.request.method).toBe('GET');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
