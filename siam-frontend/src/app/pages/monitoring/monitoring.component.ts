import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzGridModule } from 'ng-zorro-antd/grid';


@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule, NzGridModule],
  templateUrl: './monitoring.component.html',
  styleUrl: './monitoring.component.css'
})
export class MonitoringComponent implements OnInit {

  adherenceOptions: any;
  missedDosesOptions: any;
  dailyConsumptionOptions: any;

  constructor() { }

  ngOnInit(): void {
    this.initializeCharts();
  }

  initializeCharts(): void {
    // Configuração do gráfico de Adesão por Medicamento
    this.adherenceOptions = {
      title: { text: 'Adesão ao Medicamento (%)' },
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'right' },
      series: [
        {
          name: 'Adesão',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 70, name: 'Medicamento A' },
            { value: 80, name: 'Medicamento B' },
            { value: 60, name: 'Medicamento C' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    // Configuração do gráfico de Doses Esquecidas por Medicamento
    this.missedDosesOptions = {
      title: { text: 'Doses Esquecidas (Mensal)' },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Medicamento A',
          type: 'bar',
          data: [1, 2, 1, 0]
        },
        {
          name: 'Medicamento B',
          type: 'bar',
          data: [1, 0, 1, 2]
        },
        {
          name: 'Medicamento C',
          type: 'bar',
          data: [0, 1, 2, 1]
        }
      ]
    };

    // Configuração do gráfico de Consumo Diário por Medicamento
    this.dailyConsumptionOptions = {
      title: { text: 'Consumo Diário de Medicamentos' },
      tooltip: { trigger: 'axis' },
      legend: { data: ['Medicamento A', 'Medicamento B', 'Medicamento C'] },
      xAxis: {
        type: 'category',
        data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Medicamento A',
          type: 'line',
          data: [2, 3, 0, 2, 4, 1, 0]
        },
        {
          name: 'Medicamento B',
          type: 'line',
          data: [1, 1, 2, 3, 1, 1, 1]
        },
        {
          name: 'Medicamento C',
          type: 'line',
          data: [0, 1, 2, 0, 1, 1, 2]
        }
      ]
    };
  }

}