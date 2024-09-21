import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzLayoutModule, NzGridModule, NzButtonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  medicamentos = [
    {
      name: 'Medicamento A',
      dosage: 500,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      administrationSchedules: [
        { time: '08:00', daysOfWeek: ['Segunda', 'Quarta', 'Sexta'] },
        { time: '20:00', daysOfWeek: ['Terça', 'Quinta'] }
      ],
      daysTaken: ['01/01', '03/01', '05/01'],
      daysMissed: ['02/01', '04/01']
    },
    {
      name: 'Medicamento B',
      dosage: 250,
      startDate: new Date('2023-02-15'),
      endDate: new Date('2023-11-30'),
      administrationSchedules: [
        { time: '10:00', daysOfWeek: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'] }
      ],
      daysTaken: ['15/02', '16/02', '17/02', '19/02'],
      daysMissed: ['18/02', '20/02', '21/02']
    }
  ];

  editarMedicamento(medicamento: any): void {
    console.log('Editar medicamento', medicamento);
  }

  deletarMedicamento(medicamento: any): void {
    const index = this.medicamentos.indexOf(medicamento);
    if (index > -1) {
      this.medicamentos.splice(index, 1);
    }
  }

  exportToCSV(): void {
    const csvData = this.medicamentos.map(med => ({
      Medicamento: med.name,
      Dosagem: med.dosage,
      DataInicio: med.startDate.toLocaleDateString(),
      DataFim: med.endDate.toLocaleDateString(),
      Horarios: med.administrationSchedules.map(schedule => `Horário: ${schedule.time} | Dias: ${schedule.daysOfWeek.join(', ')}`).join('; '),
      DiasTomados: med.daysTaken.join(', '),
      DiasNaoTomados: med.daysMissed.join(', '),
      QuantidadeTomada: med.daysTaken.length,
      QuantidadeNaoTomada: med.daysMissed.length
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'relatorio_medicamentos.csv');
    document.body.appendChild(a);
    a.click();
  }

  exportToXLS(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.medicamentos.map(med => ({
      Medicamento: med.name,
      Dosagem: med.dosage,
      DataInicio: med.startDate.toLocaleDateString(),
      DataFim: med.endDate.toLocaleDateString(),
      Horarios: med.administrationSchedules.map(schedule => `Horário: ${schedule.time} | Dias: ${schedule.daysOfWeek.join(', ')}`).join('; '),
      DiasTomados: med.daysTaken.join(', '),
      DiasNaoTomados: med.daysMissed.join(', '),
      QuantidadeTomada: med.daysTaken.length,
      QuantidadeNaoTomada: med.daysMissed.length
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
    XLSX.writeFile(workbook, 'relatorio_medicamentos.xlsx');
  }

  private convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    return headers + rows;
  }
}