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
  takenCount?: number;
  missedCount?: number;
}

export interface CsvMedication {
  Medicamento: string;
  Dosagem: number;
  DataInicio: string;
  DataFim?: string | null;
  Horarios: string;
  QuantidadeTomada: number;
  QuantidadeNaoTomada: number;
}
