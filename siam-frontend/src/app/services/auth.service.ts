import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  User,
  RegisterResponse,
  LoginResponse,
  UserResponse,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  register(user: User): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/signup`, user);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((response) => {
          if (response.token && response.userId) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId.toString());
          }
        })
      );
  }

  getUserById(userId: number): Observable<UserResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<UserResponse>(`${this.apiUrl}/users/${userId}`, {
      headers,
    });
  }

  updateUser(userId: number, userData: Partial<User>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/user/${userId}`, userData);
  }

  changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<void>(
      `${this.apiUrl}/users/${userId}/change-password`,
      { oldPassword, newPassword },
      { headers }
    );
  }
}
