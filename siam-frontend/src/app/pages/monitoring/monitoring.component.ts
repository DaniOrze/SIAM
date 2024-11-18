import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { AdherenceService } from '../../services/adherence.service';
import {
  AdherenceData,
  MissedDosesByWeek,
  DailyConsumption,
} from '../../models/adherence.model';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule, NzGridModule],
  templateUrl: './monitoring.component.html',
  styleUrl: './monitoring.component.css',
})
export class MonitoringComponent implements OnInit {
  constructor(private adherenceService: AdherenceService) {}

  adherenceOptions: EChartsOption = {};
  missedDosesOptions: EChartsOption = {};
  dailyConsumptionOptions: EChartsOption = {};

  dayOfWeekMap: Record<string, string> = {
    Monday: 'Seg',
    Tuesday: 'Ter',
    Wednesday: 'Qua',
    Thursday: 'Qui',
    Friday: 'Sex',
    Saturday: 'Sáb',
    Sunday: 'Dom',
  };

  ngOnInit(): void {
    this.fetchAdherenceData();
    this.fetchMissedDosesData();
    this.fetchDailyConsumptionData();
  }

  fetchAdherenceData(): void {
    this.adherenceService
      .getAdherenceData()
      .subscribe((data: AdherenceData[]) => {
        const chartData = data.map((item: AdherenceData) => ({
          value: item.taken_count,
          name: item.name,
        }));

        this.adherenceOptions = {
          title: { text: 'Adesão ao Medicamento (%)' },
          tooltip: { trigger: 'item' },
          legend: { orient: 'vertical', left: 'right' },
          series: [
            {
              name: 'Adesão',
              type: 'pie',
              radius: '50%',
              data: chartData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        };
      });
  }

  fetchMissedDosesData(): void {
    this.adherenceService
      .getMissedDosesByWeek()
      .subscribe((data: MissedDosesByWeek[]) => {
        const processedData = data.map((item) => ({
          ...item,
          missed_count: Number(item.missed_count),
          week: new Date(item.week).toISOString().slice(0, 10),
        }));

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const filteredData = processedData.filter((item) => {
          const weekDate = new Date(item.week);
          return (
            weekDate.getMonth() === currentMonth &&
            weekDate.getFullYear() === currentYear
          );
        });

        const allWeeks = Array.from(
          new Set(filteredData.map((item) => item.week))
        ).sort();

        const weekMap = new Map<string, string>();
        let weekCounter = 1;
        allWeeks.forEach((week) => {
          const weekStartDate = new Date(week);
          const weekEndDate = new Date(weekStartDate);
          weekEndDate.setDate(weekEndDate.getDate() + 6);

          const formattedWeek = `Semana ${weekCounter++} (${weekStartDate.toLocaleDateString(
            'pt-BR'
          )} - ${weekEndDate.toLocaleDateString('pt-BR')})`;
          weekMap.set(week, formattedWeek);
        });

        const seriesData: Record<string, number[]> = {};
        filteredData.forEach((item) => {
          if (!seriesData[item.name]) {
            seriesData[item.name] = Array(allWeeks.length).fill(0);
          }
          const weekIndex = allWeeks.indexOf(item.week);
          seriesData[item.name][weekIndex] = item.missed_count;
        });

        const series = Object.keys(seriesData).map((name) => ({
          name,
          type: 'bar' as const,
          data: seriesData[name],
        }));

        this.missedDosesOptions = {
          title: { text: 'Doses Esquecidas (Mensal)' },
          tooltip: { trigger: 'axis' },
          xAxis: {
            type: 'category',
            data: Array.from(weekMap.values()),
          },
          yAxis: { type: 'value' },
          series: series as EChartsOption['series'],
        };

        console.log('Opções finais do gráfico:', this.missedDosesOptions);
      });
  }

  fetchDailyConsumptionData(): void {
    this.adherenceService
      .getDailyConsumption()
      .subscribe((data: DailyConsumption[]) => {
        const dayOrder = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        dayOrder.filter((day) =>
          data.some(
            (item: DailyConsumption) =>
              this.dayOfWeekMap[item.day_of_week.trim()] === day
          )
        );

        const seriesData = data.reduce(
          (acc: Record<string, number[]>, item: DailyConsumption) => {
            const mappedDay =
              this.dayOfWeekMap[item.day_of_week.trim()] ||
              item.day_of_week.trim();
            const dayIndex = dayOrder.indexOf(mappedDay);
            acc[item.name] =
              acc[item.name] || new Array(dayOrder.length).fill(0);
            acc[item.name][dayIndex] = item.taken_count;
            return acc;
          },
          {}
        );

        const series = Object.keys(seriesData).map((name) => ({
          name,
          type: 'line' as const,
          data: seriesData[name],
        }));

        this.dailyConsumptionOptions = {
          title: { text: 'Consumo Diário de Medicamentos' },
          tooltip: { trigger: 'axis' },
          legend: { data: Object.keys(seriesData) },
          xAxis: {
            type: 'category',
            data: dayOrder,
          },
          yAxis: {
            type: 'value',
          },
          series: series as EChartsOption['series'],
        };
      });
  }
}
