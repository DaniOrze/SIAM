export interface AdherenceData {
  name: string;
  taken_count: number;
  missed_count: number;
}

export interface MissedDosesByWeek {
  name: string;
  missed_count: number;
  week: string;
}

export interface DailyConsumption {
  name: string;
  taken_count: number;
  day_of_week: string;
}
