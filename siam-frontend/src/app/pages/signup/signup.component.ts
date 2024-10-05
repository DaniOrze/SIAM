import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NgxMaskDirective } from 'ngx-mask';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    NzLayoutModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    CommonModule,
    RouterLink,
    RouterOutlet,
    NzDatePickerModule,
    NgxMaskDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService
  ) {
    this.signupForm = this.fb.group({
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
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const user = this.signupForm.value;

      this.authService.register(user).subscribe({
        next: (response) => {
          console.log('Conta criada com sucesso!', response);
          this.message.success('Conta criada com sucesso!');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Erro ao criar conta:', error);
          this.message.error('Erro ao criar conta.');
        },
      });
    } else {
      console.error('Formulário inválido!');
    }
  }
}
