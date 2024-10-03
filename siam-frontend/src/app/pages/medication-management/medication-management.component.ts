// src/app/medication-management/medication-management.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MedicationService } from '../../services/medication.service';
import { Medication } from '../../models/medication.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-medication-management',
  standalone: true,
  imports: [
    NzLayoutModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    CommonModule,
    NzSelectModule,
    FormsModule,
    RouterLink,
    RouterOutlet,
    NzTableModule,
    NzIconModule,
    NzModalModule,
  ],
  templateUrl: './medication-management.component.html',
  styleUrls: ['./medication-management.component.css'],
})
export class MedicationManagementComponent implements OnInit {
  medicamentos: Medication[] = [];
  isDeleteModalVisible = false;
  selectedMedicamento: Medication | null = null;

  constructor(
    private medicationService: MedicationService,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadMedicamentos();
  }

  loadMedicamentos(): void {
    this.medicationService.getMedicamentos().subscribe(
      (data) => {
        this.medicamentos = data;

        console.log(this.medicamentos);
      },
      (error) => {
        console.error('Erro ao obter medicamentos:', error);
      }
    );
  }

  openDeleteModal(medicamento: Medication): void {
    this.selectedMedicamento = medicamento;
    this.isDeleteModalVisible = true;
  }

  handleCancel(): void {
    this.isDeleteModalVisible = false;
  }

  confirmarDelete(): void {
    if (this.selectedMedicamento?.id === undefined) {
      console.error('ID do medicamento não está definido.');
      return;
    }

    this.medicationService
      .deleteMedication(this.selectedMedicamento.id)
      .subscribe(
        () => {
          const index = this.medicamentos.indexOf(this.selectedMedicamento!);
          if (index > -1) {
            this.medicamentos.splice(index, 1);
          }
          this.message.success('Medicamento excluído com sucesso!');
          this.isDeleteModalVisible = false;
          this.selectedMedicamento = null;
        },
        (error) => {
          console.error('Erro ao deletar medicamento:', error);
          this.message.error('Erro ao excluir o medicamento. Tente novamente.');
          this.isDeleteModalVisible = false;
        }
      );
  }

  editarMedicamento(medicamento: Medication): void {
    this.router.navigate(['/edit-medication', medicamento.id]);
  }
}
