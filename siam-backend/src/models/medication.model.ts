export interface Medication {
  id?: number;
  name: string;
  dosage: number;
  administrationSchedules: Schedule[];
  startDate: Date;
  endDate: Date;
  observations?: string;
}

export interface Schedule {
  time: string;
  daysOfWeek: string[];
}
