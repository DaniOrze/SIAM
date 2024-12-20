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
import { ActivatedRoute, Router } from '@angular/router';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { MedicationService } from '../../services/medication.service';
import { Medication } from '../../models/medication.model';

@Component({
  selector: 'app-edit-alert',
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
  templateUrl: './edit-alert.component.html',
  styleUrl: './edit-alert.component.css',
})
export class EditAlertComponent implements OnInit {
  alertForm: FormGroup;
  medications: Medication[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
    private message: NzMessageService,
    private medicationService: MedicationService
  ) {
    this.alertForm = this.formBuilder.group({
      name: ['', Validators.required],
      playCount: [''],
      isActive: [true],
      medicationId: [''],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAlert(id);
    }

    this.loadMedications();
  }

  loadAlert(id: string) {
    this.alertService.getAlertById(id).subscribe((alert: Alert) => {
      this.alertForm.patchValue(alert);
    });
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
    if (this.alertForm.valid) {
      const updatedAlert = {
        ...this.alertForm.value,
        id: this.route.snapshot.paramMap.get('id'),
      };

      this.alertService.editAlert(updatedAlert).subscribe({
        next: (response: Alert) => {
          console.log('Alerta editado com sucesso!', response);
          this.message.success('Alerta editado com sucesso!');
          this.router.navigate(['/alerts']);
        },
        error: (error) => {
          console.error('Erro ao editar alerta:', error);
          this.message.error('Erro ao editar o alerta. Tente novamente.');
        },
      });
    }
  }
}
