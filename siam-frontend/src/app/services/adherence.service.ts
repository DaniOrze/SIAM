import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AdherenceData,
  DailyConsumption,
  MissedDosesByWeek,
} from '../models/adherence.model';

@Injectable({
  providedIn: 'root',
})
export class AdherenceService {
  private baseUrl = 'http://localhost:3000/adherence';

  constructor(private http: HttpClient) {}

  getAdherenceData(): Observable<AdherenceData[]> {
    return this.http.get<AdherenceData[]>(`${this.baseUrl}/get-adherence-data`);
  }

  getMissedDosesByWeek(): Observable<MissedDosesByWeek[]> {
    return this.http.get<MissedDosesByWeek[]>(
      `${this.baseUrl}/get-missed-doses-by-week`
    );
  }

  getDailyConsumption(): Observable<DailyConsumption[]> {
    return this.http.get<DailyConsumption[]>(
      `${this.baseUrl}/get-daily-consumption`
    );
  }
}
