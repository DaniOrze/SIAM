import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUserComponent } from './edit-user.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskConfig, provideEnvironmentNgxMask } from 'ngx-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { ResponsibleService } from '../../services/responsible.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { throwError } from 'rxjs';

const maskConfig: Partial<NgxMaskConfig> = {
  validation: true,
};

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;
  let responsibleServiceMock: jasmine.SpyObj<ResponsibleService>;
  let messageServiceMock: jasmine.SpyObj<NzMessageService>;

  beforeEach(async () => {
    responsibleServiceMock = jasmine.createSpyObj('ResponsibleService', [
      'getResponsibleById',
      'editResponsible',
    ]);
    messageServiceMock = jasmine.createSpyObj('NzMessageService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        EditUserComponent,
        HttpClientModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: ResponsibleService, useValue: responsibleServiceMock },
        { provide: NzMessageService, useValue: messageServiceMock },
        provideEnvironmentNgxMask(maskConfig),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.editUserForm.value).toEqual({
      fullName: '',
      cpf: '',
      rg: '',
      birthdate: null,
      phoneNumber: '',
      email: '',
      address: '',
      city: '',
      zipCode: '',
      observations: '',
    });
  });

  it('should show error message if loadResponsibleData fails', () => {
    component.responsibleId = '1';
    responsibleServiceMock.getResponsibleById.and.returnValue(
      throwError('Error')
    );

    component.loadResponsibleData();

    expect(messageServiceMock.error).toHaveBeenCalledWith(
      'Erro ao carregar os dados do responsável.'
    );
  });

  it('should show error message if form is invalid and user tries to submit', () => {
    component.submitForm();

    expect(messageServiceMock.error).toHaveBeenCalledWith(
      'Por favor, preencha todos os campos obrigatórios.'
    );
  });
});
