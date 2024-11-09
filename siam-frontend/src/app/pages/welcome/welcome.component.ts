import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { AdherenceService } from '../../services/adherence.service';
import { AdherenceData, DailyConsumption } from '../../models/adherence.model';
import { EChartsOption, SeriesOption } from 'echarts';
import { Medication } from '../../models/medication.model';
import { MedicationService } from '../../services/medication.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule, NzGridModule, NzCardModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent implements OnInit {
  medicationChartOptions: EChartsOption = {};
  adherenceChartOptions: EChartsOption = {};
  dailyMedications: Medication[] = [];
  nextMedication: Medication | null = null;

  constructor(
    private adherenceService: AdherenceService,
    private medicationService: MedicationService
  ) {}

  ngOnInit(): void {
    this.loadDailyConsumptionChart();
    this.loadAdherenceChart();
    this.loadMedications();
  }

  daysOfWeekMapping: string[] = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ];

  private loadMedications(): void {
    this.medicationService
      .getMedicamentos()
      .subscribe((medications: Medication[]) => {
        const today = new Date().getDay();
        console.log('Dia da semana:', today);

        const todayMedications = medications.filter((med) =>
          med.administrationschedules.some((schedule) =>
            schedule.daysOfWeek.includes(this.daysOfWeekMapping[today])
          )
        );

        console.log('Medicamentos do dia:', todayMedications);

        this.dailyMedications = todayMedications.sort((a, b) => {
          const timeA = this.getNextAdministrationTime(a) || '';
          const timeB = this.getNextAdministrationTime(b) || '';
          return timeA < timeB ? -1 : 1;
        });

        this.nextMedication =
          this.dailyMedications.find(
            (med) => this.getNextAdministrationTime(med) !== null
          ) || null;
      });
  }

  public getNextAdministrationTime(medication: Medication): string | null {
    const now = new Date();
    const todayTimes = this.getAdministrationTimesForToday(medication);

    const nextTime = todayTimes.find((time) => {
      const [hours, minutes] = time.split(':').map(Number);
      const timeDate = new Date();
      timeDate.setHours(hours, minutes, 0);
      return timeDate > now;
    });

    return nextTime || null;
  }

  public getAdministrationTimesForToday(medication: Medication): string[] {
    const currentDay = this.daysOfWeekMapping[new Date().getDay()];

    const todaySchedules = medication.administrationschedules
      .filter((schedule) => schedule.daysOfWeek.includes(currentDay))
      .map((schedule) => schedule.time);

    todaySchedules.sort((a, b) => a.localeCompare(b));

    return todaySchedules;
  }

  private loadDailyConsumptionChart(): void {
    this.adherenceService
      .getDailyConsumption()
      .subscribe((data: DailyConsumption[]) => {
        const daysOfWeek = Array.from(
          new Set(data.map((item) => item.day_of_week))
        );
        const medicationNames = Array.from(
          new Set(data.map((item) => item.name))
        );

        const series: SeriesOption[] = medicationNames.map((name) => ({
          name: name,
          type: 'bar',
          stack: 'medication',
          data: daysOfWeek.map((day) => {
            const item = data.find(
              (d) => d.day_of_week === day && d.name === name
            );
            return item ? item.taken_count : 0;
          }),
        }));

        this.medicationChartOptions = {
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
          },
          legend: { data: medicationNames },
          xAxis: { type: 'category', data: daysOfWeek },
          yAxis: { type: 'value' },
          series: series,
          color: ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0', '#F44336'],
        };
      });
  }

  private loadAdherenceChart(): void {
    this.adherenceService
      .getAdherenceData()
      .subscribe((data: AdherenceData[]) => {
        this.adherenceChartOptions = {
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['Adesão'],
          },
          xAxis: {
            type: 'category',
            data: data.map((item) => item.name),
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name: 'Adesão',
              type: 'line',
              smooth: true,
              data: data.map((item) => item.taken_count),
              areaStyle: {},
            },
          ],
          color: ['#FF5722'],
        };
      });
  }
}
