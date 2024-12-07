import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewMedicationComponent } from './new-medication.component';
import { MedicationService } from '../../services/medication.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('NewMedicationComponent', () => {
  let component: NewMedicationComponent;
  let fixture: ComponentFixture<NewMedicationComponent>;
  let medicationServiceMock: jasmine.SpyObj<MedicationService>;
  let messageServiceMock: jasmine.SpyObj<NzMessageService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    medicationServiceMock = jasmine.createSpyObj('MedicationService', [
      'addMedication',
    ]);
    messageServiceMock = jasmine.createSpyObj('NzMessageService', [
      'success',
      'error',
    ]);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        NewMedicationComponent,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: MedicationService, useValue: medicationServiceMock },
        { provide: NzMessageService, useValue: messageServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewMedicationComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new administration schedule when adding a schedule', () => {
    const initialLength = component.administrationSchedules.length;

    component.adicionarHorario();

    expect(component.administrationSchedules.length).toBe(initialLength + 1);
  });

  it('should remove an administration schedule when removing a schedule', () => {
    component.adicionarHorario();
    const initialLength = component.administrationSchedules.length;

    component.removerHorario(0);

    expect(component.administrationSchedules.length).toBe(initialLength - 1);
  });

  it('should initialize the form with default values', () => {
    expect(component.medicationForm).toBeTruthy();
    expect(component.medicationForm.get('name')).toBeTruthy();
    expect(component.medicationForm.get('dosage')).toBeTruthy();
    expect(component.medicationForm.get('startDate')).toBeTruthy();
    expect(component.medicationForm.get('endDate')).toBeTruthy();
    expect(
      component.medicationForm.get('administrationSchedules')
    ).toBeTruthy();
  });
});
