import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms'; 
import { MOCK_RESPONSAVEIS } from './mock-responsaveis'; 
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-user-management',
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
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {

  responsaveis = MOCK_RESPONSAVEIS;

  // Função para editar um responsável
  editarResponsavel(responsavel: any) {
    console.log('Editando responsável:', responsavel);
    // Lógica para editar o responsável
  }

  // Função para deletar um responsável
  deletarResponsavel(responsavel: any) {
    console.log('Deletando responsável:', responsavel);
    // Lógica para deletar o responsável
  }

}
