import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Medication } from '../models/medication.model';

@Injectable({
  providedIn: 'root',
})
export class MedicationService {
  private readonly apiUrl = 'http://localhost:3000/medication';
  private readonly endpoints = {
    add: `${this.apiUrl}/new-medications`,
    getAll: `${this.apiUrl}/get-medications`,
    delete: `${this.apiUrl}/delete-medications`,
    edit: `${this.apiUrl}/edit-medications`,
    getById: `${this.apiUrl}/get-medication`,
  };

  constructor(private http: HttpClient) {}

  addMedication(medicationData: Medication): Observable<Medication> {
    return this.http
      .post<Medication>(this.endpoints.add, medicationData)
      .pipe(catchError(this.handleError));
  }

  getMedicamentos(): Observable<Medication[]> {
    return this.http
      .get<Medication[]>(this.endpoints.getAll)
      .pipe(catchError(this.handleError));
  }

  deleteMedication(medicationId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.endpoints.delete}/${medicationId}`)
      .pipe(catchError(this.handleError));
  }

  editMedication(medicationData: Medication): Observable<Medication> {
    return this.http
      .put<Medication>(
        `${this.endpoints.edit}/${medicationData.id}`,
        medicationData
      )
      .pipe(catchError(this.handleError));
  }

  getMedicationById(medicationId: string): Observable<Medication> {
    return this.http
      .get<Medication>(`${this.endpoints.getById}/${medicationId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    // Lógica para tratar o erro (exibir mensagens, log, etc.)
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
