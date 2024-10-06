export interface User {
  id?: number;
  fullName: string;
  nickname?: string;
  email: string;
  phoneNumber: string;
  cpf: string;
  birthdate: Date;
  address?: string;
  city?: string;
  zipCode?: string;
  observations?: string;
  username: string;
  password: string;
}
