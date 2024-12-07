import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationManagementComponent } from './medication-management.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MedicationService } from '../../services/medication.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Medication } from '../../models/medication.model';
import { NzMessageService } from 'ng-zorro-antd/message';

describe('MedicationManagementComponent', () => {
  let component: MedicationManagementComponent;
  let fixture: ComponentFixture<MedicationManagementComponent>;
  let medicationServiceMock: jasmine.SpyObj<MedicationService>;
  let messageServiceMock: jasmine.SpyObj<NzMessageService>;

  beforeEach(async () => {
    medicationServiceMock = jasmine.createSpyObj('MedicationService', [
      'deleteMedication',
      'getMedicamentos',
    ]);

    messageServiceMock = jasmine.createSpyObj('NzMessageService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        MedicationManagementComponent,
        HttpClientModule,
        RouterTestingModule,
        NzIconModule,
      ],
      providers: [
        { provide: MedicationService, useValue: medicationServiceMock },
        { provide: NzMessageService, useValue: messageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicationManagementComponent);
    component = fixture.componentInstance;

    medicationServiceMock.getMedicamentos.and.returnValue(
      of([
        {
          id: 1,
          name: 'Aspirina',
          dosage: 500,
          startdate: '2023-01-01',
          administrationschedules: [],
        },
      ])
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load medicamentos on init', () => {
    expect(medicationServiceMock.getMedicamentos).toHaveBeenCalled();
    expect(component.medicamentos.length).toBeGreaterThan(0);
    expect(component.medicamentos[0].name).toBe('Aspirina');
  });

  it('should open delete modal', () => {
    const medicamento = {
      id: 1,
      name: 'Aspirina',
      dosage: 500,
      startdate: '2023-01-01',
      administrationschedules: [],
    };
    component.openDeleteModal(medicamento);

    expect(component.selectedMedicamento).toBe(medicamento);
    expect(component.isDeleteModalVisible).toBeTrue();
  });

  it('should close delete modal on cancel', () => {
    component.handleCancel();
    expect(component.isDeleteModalVisible).toBeFalse();
  });

  it('should navigate to edit medicamento', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    const medicamento = {
      id: 1,
      name: 'Aspirina',
      dosage: 500,
      startdate: '2023-01-01',
      administrationschedules: [],
    };

    component.editarMedicamento(medicamento);

    expect(navigateSpy).toHaveBeenCalledWith([
      '/edit-medication',
      medicamento.id,
    ]);
  });

  it('should handle error when loading medicamentos', () => {
    const errorResponse = new Error('Erro ao carregar medicamentos');

    spyOn(console, 'error');

    medicationServiceMock.getMedicamentos.and.returnValue(
      throwError(() => errorResponse)
    );

    component.loadMedicamentos();

    expect(console.error).toHaveBeenCalledWith(
      'Erro ao obter medicamentos:',
      errorResponse
    );
  });

  it('should call deleteMedication and remove the medicamento from the list on success', () => {
    const medicamento: Medication = {
      id: 1,
      name: 'Aspirina',
      dosage: 500,
      startdate: '2024-01-01',
      administrationschedules: [],
    };
    component.selectedMedicamento = medicamento;
    component.medicamentos = [medicamento];

    medicationServiceMock.deleteMedication.and.returnValue(of(void 0));

    component.confirmarDelete();

    expect(medicationServiceMock.deleteMedication).toHaveBeenCalledWith(
      medicamento.id!
    );
    expect(component.medicamentos).not.toContain(medicamento);
    expect(messageServiceMock.success).toHaveBeenCalledWith(
      'Medicamento excluído com sucesso!'
    );
    expect(component.isDeleteModalVisible).toBeFalse();
    expect(component.selectedMedicamento).toBeNull();
  });

  it('should handle error when deleting a medicamento', () => {
    const medicamento: Medication = {
      id: 1,
      name: 'Aspirina',
      dosage: 500,
      startdate: '2024-01-01',
      administrationschedules: [],
    };
    component.selectedMedicamento = medicamento;
    component.medicamentos = [medicamento];

    const errorResponse = new Error('Erro simulado ao deletar medicamento');

    medicationServiceMock.deleteMedication.and.returnValue(
      throwError(() => errorResponse)
    );

    spyOn(console, 'error');

    component.confirmarDelete();

    expect(medicationServiceMock.deleteMedication).toHaveBeenCalledWith(
      medicamento.id!
    );
    expect(console.error).toHaveBeenCalledWith(
      'Erro ao deletar medicamento:',
      errorResponse
    );
    expect(messageServiceMock.error).toHaveBeenCalledWith(
      'Erro ao excluir o medicamento. Tente novamente.'
    );
    expect(component.isDeleteModalVisible).toBeFalse();
  });

  it('should log an error and return when selectedMedicamento id is undefined', () => {
    const medicamento: Medication = {
      id: undefined,
      name: 'Aspirina',
      dosage: 500,
      startdate: '2024-01-01',
      administrationschedules: [],
    };
    component.selectedMedicamento = medicamento;

    spyOn(console, 'error');

    component.confirmarDelete();

    expect(console.error).toHaveBeenCalledWith(
      'ID do medicamento não está definido.'
    );
    expect(medicationServiceMock.deleteMedication).not.toHaveBeenCalled();
  });
});
