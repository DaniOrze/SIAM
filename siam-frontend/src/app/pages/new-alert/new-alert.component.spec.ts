import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewAlertComponent } from './new-alert.component';
import { AlertService } from '../../services/alert.service';
import { MedicationService } from '../../services/medication.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Alert } from '../../models/alert.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('NewAlertComponent', () => {
  let component: NewAlertComponent;
  let fixture: ComponentFixture<NewAlertComponent>;
  let alertServiceMock: jasmine.SpyObj<AlertService>;
  let messageServiceMock: jasmine.SpyObj<NzMessageService>;
  let medicationServiceMock: jasmine.SpyObj<MedicationService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    alertServiceMock = jasmine.createSpyObj('AlertService', ['addAlert']);
    messageServiceMock = jasmine.createSpyObj('NzMessageService', [
      'success',
      'error',
    ]);
    medicationServiceMock = jasmine.createSpyObj('MedicationService', [
      'getMedicamentos',
    ]);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        NewAlertComponent,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AlertService, useValue: alertServiceMock },
        { provide: MedicationService, useValue: medicationServiceMock },
        { provide: NzMessageService, useValue: messageServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewAlertComponent);
    component = fixture.componentInstance;

    medicationServiceMock.getMedicamentos.and.returnValue(
      of([
        {
          id: 1,
          name: 'Medicação 1',
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

  it('should show error message if alertService fails to add an alert', () => {
    const errorResponse = new Error('Erro ao adicionar alerta');
    const alert: Alert = {
      name: 'Alerta Teste',
      playCount: 2,
      isActive: true,
      medicationname: 'Medicação 1',
    };
    component.alertForm.setValue({
      name: alert.name,
      playCount: alert.playCount,
      isActive: alert.isActive,
      medicationId: 1,
    });

    alertServiceMock.addAlert.and.returnValue(throwError(() => errorResponse));

    spyOn(console, 'error');

    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith(
      'Erro ao adicionar alerta:',
      errorResponse
    );
    expect(messageServiceMock.error).toHaveBeenCalledWith(
      'Erro ao adicionar o alerta. Tente novamente.'
    );
  });

  it('should show error message if medicationService fails to load medications', () => {
    const errorResponse = new Error('Erro ao carregar medicações');
    medicationServiceMock.getMedicamentos.and.returnValue(
      throwError(() => errorResponse)
    );

    spyOn(console, 'error');

    component.loadMedications();

    expect(console.error).toHaveBeenCalledWith(
      'Erro ao carregar medicações:',
      errorResponse
    );
    expect(messageServiceMock.error).toHaveBeenCalledWith(
      'Erro ao carregar as medicações. Tente novamente.'
    );
  });
});
