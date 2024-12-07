import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let messageService: NzMessageService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [AuthService, NzMessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    messageService = TestBed.inject(NzMessageService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSubmit() and navigate on successful login', () => {
    const loginSpy = spyOn(authService, 'login').and.returnValue(
      of({ token: 'test-token', userId: 123 })
    );
    const navigateSpy = spyOn(router, 'navigate');
    const messageSpy = spyOn(messageService, 'error');

    component.loginForm.setValue({
      username: 'testuser',
      password: 'password',
    });
    component.onSubmit();

    expect(loginSpy).toHaveBeenCalledWith('testuser', 'password');
    expect(navigateSpy).toHaveBeenCalledWith(['/welcome']);
    expect(messageSpy).not.toHaveBeenCalled();
  });

  it('should display error message if login fails', () => {
    const loginSpy = spyOn(authService, 'login').and.returnValue(
      throwError({})
    );
    const messageSpy = spyOn(messageService, 'error');

    component.loginForm.setValue({
      username: 'testuser',
      password: 'password',
    });
    component.onSubmit();

    expect(loginSpy).toHaveBeenCalledWith('testuser', 'password');
    expect(messageSpy).toHaveBeenCalledWith('Erro ao tentar logar!');
  });

  it('should display error message if form is invalid', () => {
    const messageSpy = spyOn(messageService, 'error');

    component.loginForm.setValue({ username: '', password: '' });
    component.onSubmit();

    expect(messageSpy).toHaveBeenCalledWith(
      'Por favor, preencha todos os campos.'
    );
  });
});
