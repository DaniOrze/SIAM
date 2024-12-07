import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
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
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { ResponsibleService } from '../../services/responsible.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Responsible } from '../../models/responsible.model';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-new-user',
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
    NzDatePickerModule,
    NgxMaskDirective,
  ],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css',
})
export class NewUserComponent implements OnInit {
  newUserForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private responsibleService: ResponsibleService
  ) {}

  ngOnInit(): void {
    this.newUserForm = this.fb.group({
      full_name: ['', Validators.required],
      cpf: ['', Validators.required],
      rg: [''],
      birthdate: ['', Validators.required],
      phone_number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      city: [''],
      zipCode: [''],
      observations: [''],
    });
  }

  submitForm(): void {
    if (this.newUserForm.valid) {
      const responsibleData: Responsible = this.newUserForm.value;

      this.responsibleService.addResponsible(responsibleData).subscribe({
        next: (response: Responsible) => {
          console.log('Responsável adicionado com sucesso!', response);
          this.message.success('Responsável cadastrado com sucesso!');
          this.router.navigate(['/user-management']);
        },
        error: (error) => {
          console.error('Erro ao cadastrar responsável:', error);
          this.message.error('Erro ao cadastrar responsável. Tente novamente.');
        },
      });
    } else {
      this.message.error('Por favor, preencha todos os campos obrigatórios.');
    }
  }
}
