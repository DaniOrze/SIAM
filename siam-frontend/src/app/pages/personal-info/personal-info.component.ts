import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserResponse } from '../../models/user.model';

@Component({
  selector: 'app-personal-info',
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
    ReactiveFormsModule
  ],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent implements OnInit {
  editUserForm!: FormGroup;
  userId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id')!;

    this.editUserForm = this.fb.group({
      fullName: ['', Validators.required],
      nickname: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      cpf: ['', Validators.required],
      birthdate: ['', Validators.required],
      address: [''],
      city: [''],
      zipCode: [''],
      observations: [''],
    });

    this.authService.getUserById(this.userId).subscribe((userData: UserResponse) => {
      const user = userData.user;
    
      this.editUserForm.patchValue({
        fullName: user.fullName || '',
        nickname: user.nickname || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        cpf: user.cpf || '',
        birthdate: user.birthdate ? new Date(user.birthdate).toISOString().split('T')[0] : '',
        address: user.address || '',
        city: user.city || '',
        zipCode: user.zipCode || '',
        observations: user.observations || '',
      });
    });
    
    
  }

  submitForm(): void {
    if (this.editUserForm.valid) {
      this.authService.updateUser(this.userId, this.editUserForm.value).subscribe({
        next: () => {
          this.message.success('Usuário editado com sucesso!');
          this.router.navigate(['/welcome']);
        },
        error: () => {
          this.message.error('Erro ao editar usuário. Tente novamente.');
        },
      });
    }
  }
}
