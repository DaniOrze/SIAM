import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditMedicationComponent } from './edit-medication.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MedicationService } from '../../services/medication.service';
import { NzMessageService } from 'ng-zorro-antd/message';

describe('EditMedicationComponent', () => {
  let component: EditMedicationComponent;
  let fixture: ComponentFixture<EditMedicationComponent>;
  let medicationServiceMock: jasmine.SpyObj<MedicationService>;
  let messageServiceMock: jasmine.SpyObj<NzMessageService>;

  beforeEach(async () => {
    medicationServiceMock = jasmine.createSpyObj('MedicationService', [
      'getMedicationById',
      'editMedication',
    ]);
    messageServiceMock = jasmine.createSpyObj('NzMessageService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        EditMedicationComponent,
        HttpClientModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        FormBuilder,
        { provide: MedicationService, useValue: medicationServiceMock },
        { provide: NzMessageService, useValue: messageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.medicationForm.value).toEqual({
      name: '',
      dosage: '',
      startDate: null,
      endDate: null,
      observations: '',
      administrationSchedules: [],
    });
  });

  it('should call addHorario and add an empty schedule', () => {
    const initialCount = component.administrationSchedules.length;
    component.adicionarHorario();
    expect(component.administrationSchedules.length).toBe(initialCount + 1);
  });

  it('should call removerHorario and remove the schedule at the given index', () => {
    component.adicionarHorario();
    const initialCount = component.administrationSchedules.length;
    component.removerHorario(0);
    expect(component.administrationSchedules.length).toBe(initialCount - 1);
  });
});
