import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalInfoComponent } from './personal-info.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormBuilder } from '@angular/forms';

describe('PersonalInfoComponent', () => {
  let component: PersonalInfoComponent;
  let fixture: ComponentFixture<PersonalInfoComponent>;
  let authService: AuthService;
  let messageService: NzMessageService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalInfoComponent, HttpClientModule, RouterTestingModule],
      providers: [NzMessageService, AuthService, FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalInfoComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    messageService = TestBed.inject(NzMessageService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submitForm', () => {
    it('should show error message on updateUser failure', () => {
      // Mock data
      const mockFormValues = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '123456789',
        cpf: '123.456.789-00',
        birthdate: '2000-01-01',
      };
      const updateSpy = spyOn(authService, 'updateUser').and.returnValue(
        throwError(() => new Error())
      );
      const messageSpy = spyOn(messageService, 'error');
      const navigateSpy = spyOn(router, 'navigate');

      component.editUserForm.setValue({
        ...mockFormValues,
        nickname: '',
        address: '',
        city: '',
        zipCode: '',
        observations: '',
      });

      component.submitForm();

      expect(updateSpy).toHaveBeenCalledWith(
        component.userId,
        component.editUserForm.value
      );
      expect(messageSpy).toHaveBeenCalledWith(
        'Erro ao editar usuário. Tente novamente.'
      );
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should not call updateUser if the form is invalid', () => {
      const updateSpy = spyOn(authService, 'updateUser');
      const messageSpy = spyOn(messageService, 'success');
      const navigateSpy = spyOn(router, 'navigate');

      component.editUserForm.setValue({
        fullName: '',
        email: '',
        phoneNumber: '',
        cpf: '',
        birthdate: '',
        nickname: '',
        address: '',
        city: '',
        zipCode: '',
        observations: '',
      });

      component.submitForm();

      expect(updateSpy).not.toHaveBeenCalled();
      expect(messageSpy).not.toHaveBeenCalled();
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  it('should display success message and navigate to /welcome on successful user update', () => {
    const updateSpy = spyOn(authService, 'updateUser').and.returnValue(
      of(undefined)
    );
    const messageSpy = spyOn(messageService, 'success');
    const navigateSpy = spyOn(router, 'navigate');

    component.editUserForm.setValue({
      fullName: 'John Doe',
      nickname: '',
      email: 'john.doe@example.com',
      phoneNumber: '123456789',
      cpf: '123.456.789-00',
      birthdate: '2000-01-01',
      address: '',
      city: '',
      zipCode: '',
      observations: '',
    });

    component.submitForm();

    expect(updateSpy).toHaveBeenCalled();
    expect(messageSpy).toHaveBeenCalledWith('Usuário editado com sucesso!');
    expect(navigateSpy).toHaveBeenCalledWith(['/welcome']);
  });
});
