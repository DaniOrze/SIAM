import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonitoringComponent } from './monitoring.component';
import { HttpClientModule } from '@angular/common/http';
import { AdherenceService } from '../../services/adherence.service';
import { of } from 'rxjs';
import { NGX_ECHARTS_CONFIG } from 'ngx-echarts';

describe('MonitoringComponent', () => {
  let component: MonitoringComponent;
  let fixture: ComponentFixture<MonitoringComponent>;
  let adherenceServiceMock: jasmine.SpyObj<AdherenceService>;

  beforeEach(async () => {
    adherenceServiceMock = jasmine.createSpyObj('AdherenceService', [
      'getAdherenceData',
      'getMissedDosesByWeek',
      'getDailyConsumption',
    ]);

    adherenceServiceMock.getAdherenceData.and.returnValue(of([]));
    adherenceServiceMock.getMissedDosesByWeek.and.returnValue(of([]));
    adherenceServiceMock.getDailyConsumption.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [MonitoringComponent, HttpClientModule],
      providers: [
        { provide: AdherenceService, useValue: adherenceServiceMock },
        { provide: NGX_ECHARTS_CONFIG, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchAdherenceData and update adherenceOptions', () => {
    const mockAdherenceData = [
      { name: 'Medicine 1', taken_count: 50, missed_count: 1 },
      { name: 'Medicine 2', taken_count: 70, missed_count: 5 },
    ];
    adherenceServiceMock.getAdherenceData.and.returnValue(
      of(mockAdherenceData)
    );

    component.fetchAdherenceData();

    expect(adherenceServiceMock.getAdherenceData).toHaveBeenCalled();
    expect(component.adherenceOptions).toEqual({
      title: { text: 'Adesão ao Medicamento (%)' },
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'right' },
      series: [
        {
          name: 'Adesão',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 50, name: 'Medicine 1' },
            { value: 70, name: 'Medicine 2' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    });
  });

  it('should call fetchDailyConsumptionData and update dailyConsumptionOptions', () => {
    const mockDailyConsumptionData = [
      { name: 'Medicine 1', taken_count: 3, day_of_week: 'Monday' },
      { name: 'Medicine 2', taken_count: 4, day_of_week: 'Tuesday' },
    ];
    adherenceServiceMock.getDailyConsumption.and.returnValue(
      of(mockDailyConsumptionData)
    );

    component.fetchDailyConsumptionData();

    expect(adherenceServiceMock.getDailyConsumption).toHaveBeenCalled();
    expect(component.dailyConsumptionOptions).toEqual({
      title: { text: 'Consumo Diário de Medicamentos' },
      tooltip: { trigger: 'axis' },
      legend: { data: ['Medicine 1', 'Medicine 2'] },
      xAxis: {
        type: 'category',
        data: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        { name: 'Medicine 1', type: 'line', data: [0, 3, 0, 0, 0, 0, 0] },
        { name: 'Medicine 2', type: 'line', data: [0, 0, 4, 0, 0, 0, 0] },
      ],
    });
  });

  it('should fetch missed doses data and update missedDosesOptions', () => {
    const mockedMissedDosesData = [
      { name: 'Paciente A', missed_count: 3, week: '2024-12-08' },
    ];

    adherenceServiceMock.getMissedDosesByWeek.and.returnValue(
      of(mockedMissedDosesData)
    );

    component.fetchMissedDosesData();

    fixture.detectChanges();

    expect(adherenceServiceMock.getMissedDosesByWeek).toHaveBeenCalled();

    expect(component.missedDosesOptions).toEqual({
      title: { text: 'Doses Esquecidas (Mensal)' },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['Semana 1 (07/12/2024 - 13/12/2024)'],
      },
      yAxis: { type: 'value' },
      series: [{ name: 'Paciente A', type: 'bar', data: [3] }],
    });
  });
});
