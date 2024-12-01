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
import { NzIconModule, provideNzIconsPatch } from 'ng-zorro-antd/icon';
import { AlertService } from '../../services/alert.service';
import { Alert } from '../../models/alert.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { EditOutline, DeleteOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [
    CommonModule,
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
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css',
})
export class AlertsComponent implements OnInit {
  alerts: Alert[] = [];
  isDeleteModalVisible = false;
  selectedAlert: Alert | null = null;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.alertService.getAlerts().subscribe(
      (data) => {
        this.alerts = data;
        console.log(this.alerts);
      },
      (error) => {
        console.error('Erro ao obter alertas:', error);
      }
    );
  }

  openDeleteModal(alert: Alert): void {
    this.selectedAlert = alert;
    this.isDeleteModalVisible = true;
  }

  handleCancel(): void {
    this.isDeleteModalVisible = false;
  }

  confirmarDelete(): void {
    if (this.selectedAlert?.id === undefined) {
      console.error('ID do alerta não está definido.');
      return;
    }

    this.alertService.deleteAlert(this.selectedAlert.id).subscribe(
      () => {
        const index = this.alerts.indexOf(this.selectedAlert!);
        if (index > -1) {
          this.alerts.splice(index, 1);
        }
        this.message.success('Alerta excluído com sucesso!');
        this.isDeleteModalVisible = false;
        this.selectedAlert = null;
      },
      (error) => {
        console.error('Erro ao deletar alerta:', error);
        this.message.error('Erro ao excluir o alerta. Tente novamente.');
        this.isDeleteModalVisible = false;
      }
    );
  }

  editarAlert(alert: Alert): void {
    this.router.navigate(['/edit-alert', alert.id]);
  }
}
