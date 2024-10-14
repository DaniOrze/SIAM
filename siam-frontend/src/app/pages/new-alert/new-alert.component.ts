import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { Alert } from '../../models/alert.model';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { MedicationService } from '../../services/medication.service';
import { Medication } from '../../models/medication.model';

@Component({
  selector: 'app-new-alert',
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
    ReactiveFormsModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzSwitchModule,
  ],
  templateUrl: './new-alert.component.html',
  styleUrl: './new-alert.component.css',
})
export class NewAlertComponent implements OnInit {
  alertForm!: FormGroup;
  medications: Medication[] = [];

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private message: NzMessageService,
    private router: Router,
    private medicationService: MedicationService
  ) {}

  ngOnInit(): void {
    this.alertForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      duration: [Validators.required, Validators.min(1)],
      playCount: [Validators.required, Validators.min(1)],
      isActive: [true],
      medicationId: [null, Validators.required],
    });

    this.loadMedications();
  }

  loadMedications() {
    this.medicationService.getMedicamentos().subscribe({
      next: (medications: Medication[]) => {
        this.medications = medications;
      },
      error: (error) => {
        console.error('Erro ao carregar medicações:', error);
        this.message.error('Erro ao carregar as medicações. Tente novamente.');
      },
    });
  }

  onSubmit() {
    const formPayload: Alert = this.alertForm.value;

    this.alertService.addAlert(formPayload).subscribe({
      next: (response: Alert) => {
        console.log('Alerta adicionado com sucesso!', response);
        this.message.success('Alerta adicionado com sucesso!');
        this.router.navigate(['/alerts']);
      },
      error: (error) => {
        console.error('Erro ao adicionar alerta:', error);
        this.message.error('Erro ao adicionar o alerta. Tente novamente.');
      },
    });
  }
}
