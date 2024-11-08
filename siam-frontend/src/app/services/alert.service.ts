import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Alert } from '../models/alert.model';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly apiUrl = 'http://localhost:3000/alert';
  private readonly endpoints = {
    add: `${this.apiUrl}/new-alerts`,
    getAll: `${this.apiUrl}/get-alerts`,
    delete: `${this.apiUrl}/delete-alerts`,
    edit: `${this.apiUrl}/edit-alerts`,
    getById: `${this.apiUrl}/get-alert`,
  };

  constructor(private http: HttpClient) {}

  addAlert(alertData: Alert): Observable<Alert> {
    return this.http
      .post<Alert>(this.endpoints.add, alertData)
      .pipe(catchError(this.handleError));
  }

  getAlerts(): Observable<Alert[]> {
    return this.http
      .get<Alert[]>(this.endpoints.getAll)
      .pipe(catchError(this.handleError));
  }

  deleteAlert(alertId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.endpoints.delete}/${alertId}`)
      .pipe(catchError(this.handleError));
  }

  editAlert(alertData: Alert): Observable<Alert> {
    return this.http
      .put<Alert>(`${this.endpoints.edit}/${alertData.id}`, alertData)
      .pipe(catchError(this.handleError));
  }

  getAlertById(alertId: string): Observable<Alert> {
    return this.http
      .get<Alert>(`${this.endpoints.getById}/${alertId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    // Lógica para tratar o erro (exibir mensagens, log, etc.)
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
