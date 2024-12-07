import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewUserComponent } from './new-user.component';
import { ResponsibleService } from '../../services/responsible.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskConfig, provideEnvironmentNgxMask } from 'ngx-mask';

const maskConfig: Partial<NgxMaskConfig> = {
  validation: true,
};
describe('NewUserComponent', () => {
  let component: NewUserComponent;
  let fixture: ComponentFixture<NewUserComponent>;
  let responsibleServiceMock: jasmine.SpyObj<ResponsibleService>;
  let messageServiceMock: jasmine.SpyObj<NzMessageService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    responsibleServiceMock = jasmine.createSpyObj('ResponsibleService', [
      'addResponsible',
    ]);
    messageServiceMock = jasmine.createSpyObj('NzMessageService', [
      'success',
      'error',
    ]);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        NewUserComponent,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        HttpClientModule,
      ],
      providers: [
        { provide: ResponsibleService, useValue: responsibleServiceMock },
        { provide: NzMessageService, useValue: messageServiceMock },
        { provide: Router, useValue: routerMock },
        provideEnvironmentNgxMask(maskConfig),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewUserComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show error message if form is invalid and user tries to submit', () => {
    component.submitForm();

    expect(messageServiceMock.error).toHaveBeenCalledWith(
      'Por favor, preencha todos os campos obrigatórios.'
    );
  });

  it('should initialize form with empty values', () => {
    expect(component.newUserForm.value).toEqual({
      full_name: '',
      cpf: '',
      rg: '',
      birthdate: '',
      phone_number: '',
      email: '',
      address: '',
      city: '',
      zipCode: '',
      observations: '',
    });
  });
});
