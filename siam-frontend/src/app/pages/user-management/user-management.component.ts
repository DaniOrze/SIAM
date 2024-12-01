import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule, provideNzIconsPatch } from 'ng-zorro-antd/icon';
import { Router } from '@angular/router';
import { ResponsibleService } from '../../services/responsible.service';
import { Responsible } from '../../models/responsible.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { EditOutline, DeleteOutline } from '@ant-design/icons-angular/icons';

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
    NzIconModule,
    NzModalModule,
  ],
  providers: [
    provideNzIconsPatch([
    EditOutline,
    DeleteOutline
  ]),
],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent {
  responsaveis: Responsible[] = [];
  isDeleteModalVisible = false;
  selectedResponsible: Responsible | null = null;

  constructor(
    private responsibleService: ResponsibleService,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadResponsaveis();
  }

  loadResponsaveis(): void {
    this.responsibleService.getResponsibles().subscribe(
      (data: Responsible[]) => {
        this.responsaveis = data;
        console.log(this.responsaveis);
      },
      (error) => {
        console.error('Erro ao obter responsáveis:', error);
      }
    );
  }

  openDeleteModal(responsavel: Responsible): void {
    this.selectedResponsible = responsavel;
    this.isDeleteModalVisible = true;
  }

  handleCancel(): void {
    this.isDeleteModalVisible = false;
  }

  confirmarDelete(): void {
    if (this.selectedResponsible?.id === undefined) {
      console.error('ID do responsável não está definido.');
      return;
    }

    this.responsibleService
      .deleteResponsible(this.selectedResponsible.id)
      .subscribe(
        () => {
          const index = this.responsaveis.indexOf(this.selectedResponsible!);
          if (index > -1) {
            this.responsaveis.splice(index, 1);
          }
          this.message.success('Responsável excluído com sucesso!');
          this.isDeleteModalVisible = false;
          this.selectedResponsible = null;
        },
        (error) => {
          console.error('Erro ao excluir responsável:', error);
          this.message.error('Erro ao excluir o responsável. Tente novamente.');
          this.isDeleteModalVisible = false;
        }
      );
  }

  editarResponsavel(responsavel: Responsible): void {
    this.router.navigate(['/edit-responsible', responsavel.id]);
  }
}
