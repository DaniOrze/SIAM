export interface Responsible {
  id?: number;
  full_name: string;
  cpf: string;
  rg?: string;
  birthdate: string;
  phone_number: string;
  email: string;
  address?: string;
  city?: string;
  zipCode?: string;
  observations?: string;
}
