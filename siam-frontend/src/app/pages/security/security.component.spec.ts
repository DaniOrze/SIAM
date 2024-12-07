import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecurityComponent } from './security.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('SecurityComponent', () => {
  let component: SecurityComponent;
  let fixture: ComponentFixture<SecurityComponent>;
  let authService: AuthService;
  let messageService: NzMessageService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityComponent, HttpClientModule, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['changePassword']) },
        { provide: NzMessageService, useValue: jasmine.createSpyObj('NzMessageService', ['success', 'warning', 'error']) },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    messageService = TestBed.inject(NzMessageService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show warning if passwords do not match', () => {
    component.passwordForm.setValue({
      oldPassword: 'oldPassword123',
      newPassword: 'newPassword123',
      confirmPassword: 'differentPassword123',
    });

    component.changePassword();

    expect(messageService.warning).toHaveBeenCalledWith('A nova senha e a confirmação não correspondem.');
  });

  it('should call authService.changePassword and show success message on success', () => {
    component.selectedUserId = 1;
    component.passwordForm.setValue({
      oldPassword: 'oldPassword123',
      newPassword: 'newPassword123',
      confirmPassword: 'newPassword123',
    });

    (authService.changePassword as jasmine.Spy).and.returnValue(of(null));

    component.changePassword();

    expect(authService.changePassword).toHaveBeenCalledWith(1, 'oldPassword123', 'newPassword123');
    expect(messageService.success).toHaveBeenCalledWith('Senha editada com sucesso!');
    expect(router.navigate).toHaveBeenCalledWith(['/welcome']);
  });

  it('should show error message on API error', () => {
    component.selectedUserId = 1;
    component.passwordForm.setValue({
      oldPassword: 'oldPassword123',
      newPassword: 'newPassword123',
      confirmPassword: 'newPassword123',
    });

    (authService.changePassword as jasmine.Spy).and.returnValue(throwError(() => new Error('API error')));

    component.changePassword();

    expect(authService.changePassword).toHaveBeenCalledWith(1, 'oldPassword123', 'newPassword123');
    expect(messageService.error).toHaveBeenCalledWith('Erro ao editar senha. Tente novamente.');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should assign userId to selectedUserId when userId is present in localStorage', () => {
    localStorage.setItem('userId', '42');
    component.ngOnInit();
    expect(component.selectedUserId).toBe(42);
  });

  it('should navigate to /login when userId is not present in localStorage', () => {
    localStorage.removeItem('userId');
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

});
