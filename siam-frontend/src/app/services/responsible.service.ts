import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Responsible } from '../models/responsible.model';

@Injectable({
  providedIn: 'root',
})
export class ResponsibleService {
  private readonly apiUrl = 'http://localhost:3000';
  private readonly endpoints = {
    add: `${this.apiUrl}/new-responsibles`,
    getAll: `${this.apiUrl}/get-responsibles`,
    delete: `${this.apiUrl}/delete-responsibles`,
    edit: `${this.apiUrl}/edit-responsibles`,
    getById: `${this.apiUrl}/get-responsible`,
  };

  constructor(private http: HttpClient) {}

  addResponsible(responsibleData: Responsible): Observable<Responsible> {
    return this.http
      .post<Responsible>(this.endpoints.add, responsibleData)
      .pipe(catchError(this.handleError));
  }

  getResponsibles(): Observable<Responsible[]> {
    return this.http
      .get<Responsible[]>(this.endpoints.getAll)
      .pipe(catchError(this.handleError));
  }

  deleteResponsible(responsibleId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.endpoints.delete}/${responsibleId}`)
      .pipe(catchError(this.handleError));
  }

  editResponsible(responsibleData: Responsible): Observable<Responsible> {
    return this.http
      .put<Responsible>(
        `${this.endpoints.edit}/${responsibleData.id}`,
        responsibleData
      )
      .pipe(catchError(this.handleError));
  }

  getResponsibleById(responsibleId: string): Observable<Responsible> {
    return this.http
      .get<Responsible>(`${this.endpoints.getById}/${responsibleId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
