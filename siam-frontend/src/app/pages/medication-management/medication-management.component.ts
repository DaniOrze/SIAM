import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms'; 
import { MOCK_MEDICAMENTOS } from './mock-remedios';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';

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
    NzIconModule],
  templateUrl: './medication-management.component.html',
  styleUrl: './medication-management.component.css'
})
export class MedicationManagementComponent {

  medicamentos = MOCK_MEDICAMENTOS;

  editarMedicamento(medicamento: any): void {
    // Lógica para editar o medicamento
    console.log('Editar medicamento', medicamento);
  }

  deletarMedicamento(medicamento: any): void {
    // Lógica para deletar o medicamento
    const index = this.medicamentos.indexOf(medicamento);
    if (index > -1) {
      this.medicamentos.splice(index, 1);
    }
  }

}
