export interface User {
  fullName: string;
  nickname?: string;
  email: string;
  phoneNumber: string;
  cpf: string;
  birthdate: string;
  address: string;
  city: string;
  zipCode: string;
  observations?: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  userId?: number;
}

export interface LoginResponse {
  token: string;
  userId: number;
}

export interface UserResponse {
  user: User;
}
