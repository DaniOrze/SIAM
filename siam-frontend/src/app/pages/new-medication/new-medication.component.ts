import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-medication',
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
    NzCheckboxModule],
  templateUrl: './new-medication.component.html',
  styleUrl: './new-medication.component.css'
})
export class NewMedicationComponent implements OnInit {
  medicationForm!: FormGroup;
  days: string[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']; 
  checkOptions: Array<{ label: string, value: string, checked: boolean }> = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.medicationForm = this.fb.group({
      name: ['', Validators.required],
      dosage: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      administrationSchedules: this.fb.array([])
    });

    this.adicionarHorario();
  }

  adicionarHorario() {
    const scheduleGroup = this.fb.group({
      time: ['', Validators.required],
      daysOfWeek: [this.days.map(day => ({ label: day, value: day, checked: false }))]
    });
    this.administrationSchedules.push(scheduleGroup);
  }

  get administrationSchedules(): FormArray {
    return this.medicationForm.get('administrationSchedules') as FormArray;
  }

  removerHorario(index: number) {
    this.administrationSchedules.removeAt(index);
  }

  onSubmit() {
    const formValue = this.medicationForm.value;

    const schedules = (formValue.administrationSchedules as Array<{ time: string, daysOfWeek: Array<{ value: string, label: string, checked: boolean }> }>).map(schedule => {
      const selectedDays = (schedule.daysOfWeek as Array<{ value: string, label: string, checked: boolean }>)
        .filter((day: { value: string, label: string, checked: boolean }) => day.checked)
        .map((day: { value: string, label: string, checked: boolean }) => day.value);
      
      return { ...schedule, daysOfWeek: selectedDays };
    });

    const formPayload = {
      ...formValue,
      administrationSchedules: schedules
    };

    console.log('Form Data:', formPayload);
  }
  
}
