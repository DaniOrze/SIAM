export interface MedicationLog {
  id?: number;
  medicationId: number;
  taken: boolean;
  dateTaken: Date;
}
