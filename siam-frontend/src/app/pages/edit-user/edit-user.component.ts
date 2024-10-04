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
import { ActivatedRoute, Router } from '@angular/router';
import { ResponsibleService } from '../../services/responsible.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Responsible } from '../../models/responsible.model';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-edit-user',
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
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent implements OnInit {
  editUserForm!: FormGroup;
  responsibleId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private responsibleService: ResponsibleService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.responsibleId = this.route.snapshot.paramMap.get('id') || '';
    this.initializeForm();
    if (this.responsibleId) {
      this.loadResponsibleData();
    }
  }

  initializeForm(): void {
    this.editUserForm = this.fb.group({
      fullName: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      rg: [''],
      birthdate: [null, [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      city: [''],
      zipCode: [''],
      observations: [''],
    });
  }

  loadResponsibleData(): void {
    this.responsibleService.getResponsibleById(this.responsibleId).subscribe({
      next: (responsible: Responsible) => {
        this.editUserForm.patchValue({
          fullName: responsible.full_name,
          cpf: responsible.cpf,
          rg: responsible.rg,
          birthdate: new Date(responsible.birthdate),
          phoneNumber: responsible.phone_number,
          email: responsible.email,
          address: responsible.address,
          city: responsible.city,
          zipCode: responsible.zipCode,
          observations: responsible.observations,
        });
      },
      error: (err) => {
        this.message.error('Erro ao carregar os dados do responsável.');
        console.error(err);
      },
    });
  }

  submitForm(): void {
    if (this.editUserForm.valid) {
      const updatedResponsible: Responsible = {
        ...this.editUserForm.value,
        id: this.responsibleId,
      };

      this.responsibleService.editResponsible(updatedResponsible).subscribe({
        next: () => {
          this.message.success('Responsável atualizado com sucesso!');
          this.router.navigate(['/user-management']);
        },
        error: (err) => {
          this.message.error('Erro ao atualizar o responsável.');
          console.error(err);
        },
      });
    } else {
      this.message.error('Por favor, preencha todos os campos obrigatórios.');
    }
  }
}
