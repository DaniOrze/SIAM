import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementComponent } from './user-management.component';
import { ResponsibleService } from '../../services/responsible.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Responsible } from '../../models/responsible.model';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let responsibleServiceMock: jasmine.SpyObj<ResponsibleService>;
  let messageServiceMock: jasmine.SpyObj<NzMessageService>;
  let router: Router;

  beforeEach(async () => {
    responsibleServiceMock = jasmine.createSpyObj('ResponsibleService', [
      'getResponsibles',
      'deleteResponsible',
    ]);

    messageServiceMock = jasmine.createSpyObj('NzMessageService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [UserManagementComponent, HttpClientModule, RouterTestingModule],
      providers: [
        { provide: ResponsibleService, useValue: responsibleServiceMock },
        { provide: NzMessageService, useValue: messageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    responsibleServiceMock.getResponsibles.and.returnValue(
      of([
        {
          id: 1,
          full_name: 'João da Silva',
          cpf: '123.456.789-00',
          birthdate: '1980-01-01',
          phone_number: '(11) 99999-9999',
          email: 'joao@example.com',
        },
      ])
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load responsaveis on init', () => {
    expect(responsibleServiceMock.getResponsibles).toHaveBeenCalled();
    expect(component.responsaveis.length).toBeGreaterThan(0);
    expect(component.responsaveis[0].full_name).toBe('João da Silva');
  });

  it('should open delete modal', () => {
    const responsavel: Responsible = {
      id: 1,
      full_name: 'João da Silva',
      cpf: '123.456.789-00',
      birthdate: '1980-01-01',
      phone_number: '(11) 99999-9999',
      email: 'joao@example.com',
    };

    component.openDeleteModal(responsavel);

    expect(component.selectedResponsible).toBe(responsavel);
    expect(component.isDeleteModalVisible).toBeTrue();
  });

  it('should close delete modal on cancel', () => {
    component.handleCancel();
    expect(component.isDeleteModalVisible).toBeFalse();
  });

  it('should navigate to edit responsible', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const responsavel: Responsible = {
      id: 1,
      full_name: 'João da Silva',
      cpf: '123.456.789-00',
      birthdate: '1980-01-01',
      phone_number: '(11) 99999-9999',
      email: 'joao@example.com',
    };

    component.editarResponsavel(responsavel);

    expect(navigateSpy).toHaveBeenCalledWith([
      '/edit-responsible',
      responsavel.id,
    ]);
  });

  it('should log an error when failing to load responsaveis', () => {
    const errorResponse = new Error('Erro ao carregar responsáveis');
    spyOn(console, 'error');

    responsibleServiceMock.getResponsibles.and.returnValue(
      throwError(() => errorResponse)
    );

    component.loadResponsaveis();

    expect(console.error).toHaveBeenCalledWith(
      'Erro ao obter responsáveis:',
      errorResponse
    );
  });

  it('should call deleteResponsible and remove the responsible from the list on success', () => {
    const responsavel: Responsible = {
      id: 1,
      full_name: 'João da Silva',
      cpf: '123.456.789-00',
      birthdate: '1980-01-01',
      phone_number: '(11) 99999-9999',
      email: 'joao@example.com',
    };
    component.selectedResponsible = responsavel;
    component.responsaveis = [responsavel];

    responsibleServiceMock.deleteResponsible.and.returnValue(of(void 0));

    component.confirmarDelete();

    expect(responsibleServiceMock.deleteResponsible).toHaveBeenCalledWith(
      responsavel.id!
    );
    expect(component.responsaveis).not.toContain(responsavel);
    expect(messageServiceMock.success).toHaveBeenCalledWith(
      'Responsável excluído com sucesso!'
    );
    expect(component.isDeleteModalVisible).toBeFalse();
    expect(component.selectedResponsible).toBeNull();
  });

  it('should handle error when deleting a responsible', () => {
    const responsavel: Responsible = {
      id: 1,
      full_name: 'João da Silva',
      cpf: '123.456.789-00',
      birthdate: '1980-01-01',
      phone_number: '(11) 99999-9999',
      email: 'joao@example.com',
    };
    component.selectedResponsible = responsavel;
    component.responsaveis = [responsavel];

    const errorResponse = new Error('Erro simulado ao excluir responsável');
    responsibleServiceMock.deleteResponsible.and.returnValue(
      throwError(() => errorResponse)
    );

    spyOn(console, 'error');

    component.confirmarDelete();

    expect(responsibleServiceMock.deleteResponsible).toHaveBeenCalledWith(
      responsavel.id!
    );
    expect(console.error).toHaveBeenCalledWith(
      'Erro ao excluir responsável:',
      errorResponse
    );
    expect(messageServiceMock.error).toHaveBeenCalledWith(
      'Erro ao excluir o responsável. Tente novamente.'
    );
    expect(component.isDeleteModalVisible).toBeFalse();
  });

  it('should log an error and return when selectedResponsible id is undefined', () => {
    const responsavel: Responsible = {
      id: undefined,
      full_name: 'João da Silva',
      cpf: '123.456.789-00',
      birthdate: '1980-01-01',
      phone_number: '(11) 99999-9999',
      email: 'joao@example.com',
    };
    component.selectedResponsible = responsavel;

    spyOn(console, 'error');

    component.confirmarDelete();

    expect(console.error).toHaveBeenCalledWith(
      'ID do responsável não está definido.'
    );
    expect(responsibleServiceMock.deleteResponsible).not.toHaveBeenCalled();
  });
});
