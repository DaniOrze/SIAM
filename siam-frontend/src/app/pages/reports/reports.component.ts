import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MedicationService } from '../../services/medication.service';
import { CsvMedication, Medication } from '../../models/medication.model';
import { AdherenceService } from '../../services/adherence.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzLayoutModule,
    NzGridModule,
    NzButtonModule,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  medicamentos: Medication[] = [];

  constructor(
    private medicationService: MedicationService,
    private adherenceService: AdherenceService
  ) {}

  ngOnInit(): void {
    this.loadMedications();
  }

  private loadMedications(): void {
    this.medicationService.getMedicamentos().subscribe({
      next: (data) => {
        this.medicamentos = data;

        this.adherenceService.getAdherenceData().subscribe({
          next: (adherenceData) => {
            this.medicamentos.forEach((med) => {
              const adherence = adherenceData.find((a) => a.name === med.name);
              if (adherence) {
                med.takenCount = adherence.taken_count;
                med.missedCount = adherence.missed_count;
              }
            });
          },
          error: (err) =>
            console.error('Erro ao carregar dados de adesão:', err),
        });
      },
      error: (err) => console.error('Erro ao carregar medicamentos:', err),
    });
  }

  exportToCSV(): void {
    const csvData = this.medicamentos.map((med) => ({
      Medicamento: med.name,
      Dosagem: med.dosage,
      DataInicio: med.startdate,
      DataFim: med.enddate,
      Horarios: med.administrationschedules
        .map(
          (schedule) =>
            `Horário: ${schedule.time} | Dias: ${schedule.daysOfWeek.join(
              ', '
            )}`
        )
        .join('; '),
      QuantidadeTomada: med.takenCount || 0,
      QuantidadeNaoTomada: med.missedCount || 0,
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'relatorio_medicamentos.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  exportToXLS(): void {
    const worksheet = XLSX.utils.json_to_sheet(
      this.medicamentos.map((med) => ({
        Medicamento: med.name,
        Dosagem: med.dosage,
        DataInicio: med.startdate,
        DataFim: med.enddate,
        Horarios: med.administrationschedules
          .map(
            (schedule) =>
              `Horário: ${schedule.time} | Dias: ${schedule.daysOfWeek.join(
                ', '
              )}`
          )
          .join('; '),
        QuantidadeTomada: med.takenCount || 0,
        QuantidadeNaoTomada: med.missedCount || 0,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
    XLSX.writeFile(workbook, 'relatorio_medicamentos.xlsx');
  }

  private convertToCSV(data: CsvMedication[]): string {
    const headers = Object.keys(data[0]).join(',') + '\n';
    const rows = data
      .map((row) =>
        Object.values(row)
          .map((value) => `"${value}"`)
          .join(',')
      )
      .join('\n');

    return headers + rows;
  }
}
