import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';


@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule, NzGridModule, NzCardModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  medicationChartOptions: any;
  adherenceChartOptions: any;

  constructor() {
    this.medicationChartOptions = {
      title: {
        text: 'Dispensação de Medicamentos'
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [5, 20, 36, 10, 10, 20, 30],
          type: 'bar',
          color: '#4CAF50'
        }
      ]
    };

    this.adherenceChartOptions = {
      title: {
        text: 'Adesão ao Tratamento'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Adesão']
      },
      xAxis: {
        type: 'category',
        data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Adesão',
          type: 'line',
          smooth: true,
          data: [85, 88, 90, 75, 95],
          areaStyle: {}
        }
      ],
      color: ['#FF5722']
    };
  }
}