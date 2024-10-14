export interface Alert {
  id?: number;
  name: string;
  type: string;
  duration: number;
  playCount: number;
  isActive: boolean;
  medicationname?: string;
}
