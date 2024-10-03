export interface AdministrationSchedule {
  time: string;
  daysOfWeek: string[];
}

export interface Medication {
  id?: number;
  name: string;
  dosage: number;
  startdate: string;
  enddate?: string | null;
  administrationschedules: AdministrationSchedule[];
  observations?: string;
}
