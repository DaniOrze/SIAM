export interface Responsible {
  id?: number;
  fullName: string;
  cpf: string;
  rg?: string;
  birthdate: string;
  phoneNumber: string;
  email: string;
  address?: string;
  city?: string;
  zipCode?: string;
  observations?: string;
}
