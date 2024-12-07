import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import {
  User,
  RegisterResponse,
  LoginResponse,
  UserResponse,
} from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    fullName: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '1234567890',
    cpf: '12345678900',
    birthdate: '1990-01-01',
    address: '123 Main St',
    city: 'Springfield',
    zipCode: '12345',
    username: 'johndoe',
    password: 'password123',
  };

  const mockRegisterResponse: RegisterResponse = {
    message: 'User created',
    userId: 1,
  };
  const mockLoginResponse: LoginResponse = {
    token: 'fake-jwt-token',
    userId: 1,
  };
  const mockUserResponse: UserResponse = { user: mockUser };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    service.register(mockUser).subscribe((response) => {
      expect(response.message).toBe('User created');
      expect(response.userId).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:3000/signup');
    expect(req.request.method).toBe('POST');
    req.flush(mockRegisterResponse);
  });

  it('should login a user and store token and userId in localStorage', () => {
    service.login('johndoe', 'password123').subscribe((response) => {
      expect(response.token).toBe('fake-jwt-token');
      expect(response.userId).toBe(1);
      expect(localStorage.getItem('token')).toBe('fake-jwt-token');
      expect(localStorage.getItem('userId')).toBe('1');
    });

    const req = httpMock.expectOne('http://localhost:3000/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockLoginResponse);
  });

  it('should get user by ID', () => {
    localStorage.setItem('token', 'fake-jwt-token');

    service.getUserById(1).subscribe((response) => {
      expect(response.user.fullName).toBe('John Doe');
      expect(response.user.email).toBe('john@example.com');
    });

    const req = httpMock.expectOne('http://localhost:3000/users/1');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    req.flush(mockUserResponse);
  });

  it('should update user data', () => {
    const updatedUserData: Partial<User> = { phoneNumber: '0987654321' };

    service.updateUser(1, updatedUserData).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/user/1');
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should change user password', () => {
    const oldPassword = 'password123';
    const newPassword = 'newpassword123';

    localStorage.setItem('token', 'fake-jwt-token');

    service.changePassword(1, oldPassword, newPassword).subscribe();

    const req = httpMock.expectOne(
      'http://localhost:3000/users/1/change-password'
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    req.flush({});
  });
});
