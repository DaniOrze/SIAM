import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsComponent } from './reports.component';
import { MedicationService } from '../../services/medication.service';
import { AdherenceService } from '../../services/adherence.service';
import { of, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let medicationServiceMock: jasmine.SpyObj<MedicationService>;
  let adherenceServiceMock: jasmine.SpyObj<AdherenceService>;

  beforeEach(async () => {
    medicationServiceMock = jasmine.createSpyObj('MedicationService', [
      'getMedicamentos',
    ]);
    adherenceServiceMock = jasmine.createSpyObj('AdherenceService', [
      'getAdherenceData',
    ]);

    await TestBed.configureTestingModule({
      imports: [ReportsComponent, HttpClientModule],
      providers: [
        { provide: MedicationService, useValue: medicationServiceMock },
        { provide: AdherenceService, useValue: adherenceServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;

    medicationServiceMock.getMedicamentos.and.returnValue(
      of([
        {
          id: 1,
          name: 'Aspirina',
          dosage: 500,
          startdate: '2023-01-01',
          administrationschedules: [
            { time: '08:00', daysOfWeek: ['Monday', 'Wednesday'] },
          ],
        },
      ])
    );

    adherenceServiceMock.getAdherenceData.and.returnValue(
      of([
        {
          name: 'Aspirina',
          taken_count: 20,
          missed_count: 5,
        },
      ])
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load medicamentos and adherence data on init', () => {
    expect(medicationServiceMock.getMedicamentos).toHaveBeenCalled();
    expect(adherenceServiceMock.getAdherenceData).toHaveBeenCalled();
    expect(component.medicamentos.length).toBeGreaterThan(0);
    expect(component.medicamentos[0].name).toBe('Aspirina');
    expect(component.medicamentos[0].takenCount).toBe(20);
    expect(component.medicamentos[0].missedCount).toBe(5);
  });

  it('should handle error when loading medicamentos', () => {
    const errorResponse = new Error('Erro ao carregar medicamentos');
    medicationServiceMock.getMedicamentos.and.returnValue(
      throwError(() => errorResponse)
    );

    spyOn(console, 'error');
    component.loadMedications();

    expect(console.error).toHaveBeenCalledWith(
      'Erro ao carregar medicamentos:',
      errorResponse
    );
  });

  it('should handle error when loading adherence data', () => {
    const errorResponse = new Error('Erro ao carregar dados de adesão');
    adherenceServiceMock.getAdherenceData.and.returnValue(
      throwError(() => errorResponse)
    );

    spyOn(console, 'error');
    component.loadMedications();

    expect(console.error).toHaveBeenCalledWith(
      'Erro ao carregar dados de adesão:',
      errorResponse
    );
  });

  it('should export to CSV', () => {
    const csvSpy = spyOn(component, 'convertToCSV').and.callThrough();
    const downloadSpy = spyOn(document.body, 'appendChild').and.callThrough();

    component.exportToCSV();

    expect(csvSpy).toHaveBeenCalled();
    expect(downloadSpy).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalledWith(
      jasmine.any(HTMLAnchorElement)
    );
  });

  it('should correctly format the CSV data', () => {
    const data = [
      {
        Medicamento: 'Aspirina',
        Dosagem: 500,
        DataInicio: '2023-01-01',
        DataFim: null,
        Horarios: 'Horário: 08:00 | Dias: Monday, Wednesday',
        QuantidadeTomada: 20,
        QuantidadeNaoTomada: 5,
      },
    ];
    const csv = component.convertToCSV(data);

    expect(csv).toContain('Medicamento');
    expect(csv).toContain('Aspirina');
    expect(csv).toContain('500');
    expect(csv).toContain('2023-01-01');
    expect(csv).toContain('Horário: 08:00 | Dias: Monday, Wednesday');
  });
});
