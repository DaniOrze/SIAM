import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MedicationService } from '../../services/medication.service';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import {
  AdministrationSchedule,
  Medication,
} from '../../models/medication.model';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-edit-medication',
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    NzGridModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    FormsModule,
    NzIconModule,
    NzTableModule,
    RouterLink,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzCheckboxModule,
    NzDatePickerModule,
  ],
  templateUrl: './edit-medication.component.html',
  styleUrls: ['./edit-medication.component.css'],
})
export class EditMedicationComponent implements OnInit {
  medicationForm: FormGroup;
  days: string[] = [
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
    'Domingo',
  ];
  checkOptions: { label: string; value: string; checked: boolean }[] = [];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private medicationService: MedicationService,
    private router: Router,
    private message: NzMessageService
  ) {
    this.medicationForm = this.formBuilder.group({
      name: [''],
      dosage: [''],
      startDate: [null],
      endDate: [null],
      observations: [''],
      administrationSchedules: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMedication(id);
    }
  }

  loadMedication(id: string) {
    this.medicationService
      .getMedicationById(id)
      .subscribe((medication: Medication) => {
        const formattedMedication = {
          ...medication,
          startDate: medication.startdate
            ? new Date(medication.startdate)
            : null,
          endDate: medication.enddate ? new Date(medication.enddate) : null,
        };

        this.medicationForm.patchValue(formattedMedication);
        this.setAdministrationSchedules(medication.administrationschedules);
      });
  }

  setAdministrationSchedules(schedules: AdministrationSchedule[]) {
    const scheduleFormGroups = schedules.map((schedule) =>
      this.formBuilder.group({
        time: [schedule.time],
        daysOfWeek: [
          this.days.map((day) => ({
            label: day,
            value: day,
            checked: schedule.daysOfWeek.includes(day),
          })),
        ],
      })
    );

    const scheduleFormArray = this.formBuilder.array(scheduleFormGroups);
    this.medicationForm.setControl(
      'administrationSchedules',
      scheduleFormArray
    );
  }

  get administrationSchedules(): FormArray {
    return this.medicationForm.get('administrationSchedules') as FormArray;
  }

  adicionarHorario() {
    const schedules = this.administrationSchedules;
    schedules.push(
      this.formBuilder.group({
        time: [''],
        daysOfWeek: [
          this.days.map((day) => ({
            label: day,
            value: day,
            checked: false,
          })),
        ],
      })
    );
  }
  

  removerHorario(index: number) {
    const schedules = this.administrationSchedules;
    schedules.removeAt(index);
  }

  onSubmit() {
    if (this.medicationForm.valid) {
      const formValue = this.medicationForm.value;
      const id = this.route.snapshot.paramMap.get('id');

      const schedules = (
        formValue.administrationSchedules as {
          time: string;
          daysOfWeek: { value: string; label: string; checked: boolean }[];
        }[]
      ).map((schedule) => {
        const selectedDays = (
          schedule.daysOfWeek as {
            value: string;
            label: string;
            checked: boolean;
          }[]
        )
          .filter(
            (day: { value: string; label: string; checked: boolean }) =>
              day.checked
          )
          .map(
            (day: { value: string; label: string; checked: boolean }) =>
              day.value
          );

        return { ...schedule, daysOfWeek: selectedDays };
      });

      const updatedMedication = {
        ...formValue,
        id,
        administrationSchedules: schedules,
        startdate: formValue.startDate
          ? formValue.startDate.toISOString()
          : null,
        enddate: formValue.endDate ? formValue.endDate.toISOString() : null,
      };

      this.medicationService.editMedication(updatedMedication).subscribe({
        next: (response: Medication) => {
          console.log('Medicamento adicionado com sucesso!', response);
          this.message.success('Medicamento editado com sucesso!');
          this.router.navigate(['/medication-management']);
        },
        error: (error) => {
          console.error('Erro ao editar medicamento:', error);
          this.message.error('Erro ao editar o medicamento. Tente novamente.');
        },
      });
    }
  }
}
