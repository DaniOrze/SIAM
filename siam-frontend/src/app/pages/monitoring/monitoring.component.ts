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
        const weekMap = new Map<string, string>();
        let weekCounter = 1;

        const weeks = [
          ...new Set(
            data.map((item: MissedDosesByWeek) => {
              const weekStartDate = new Date(item.week);
              const weekEndDate = new Date(weekStartDate);
              weekEndDate.setDate(weekEndDate.getDate() + 6);

              const weekKey = weekStartDate.toISOString().slice(0, 10);

              if (!weekMap.has(weekKey)) {
                const formattedWeek = `Semana ${weekCounter++} (${weekStartDate.toLocaleDateString(
                  'pt-BR'
                )} - ${weekEndDate.toLocaleDateString('pt-BR')})`;
                weekMap.set(weekKey, formattedWeek);
              }

              return weekMap.get(weekKey);
            })
          ),
        ].filter((week): week is string => !!week);

        const seriesData = data.reduce(
          (acc: Record<string, number[]>, item: MissedDosesByWeek) => {
            acc[item.name] = acc[item.name] || [];
            acc[item.name].push(item.missed_count);
            return acc;
          },
          {}
        );

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
            data: weeks,
          },
          yAxis: {
            type: 'value',
          },
          series: series as EChartsOption['series'],
        };
      });
  }

  fetchDailyConsumptionData(): void {
    this.adherenceService
      .getDailyConsumption()
      .subscribe((data: DailyConsumption[]) => {
        const daysOfWeek = [
          ...new Set(
            data.map(
              (item: DailyConsumption) =>
                this.dayOfWeekMap[item.day_of_week.trim()] ||
                item.day_of_week.trim()
            )
          ),
        ];

        const seriesData = data.reduce(
          (acc: Record<string, number[]>, item: DailyConsumption) => {
            acc[item.name] = acc[item.name] || [];
            acc[item.name].push(item.taken_count);
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
            data: daysOfWeek,
          },
          yAxis: {
            type: 'value',
          },
          series: series as EChartsOption['series'],
        };
      });
  }
}
