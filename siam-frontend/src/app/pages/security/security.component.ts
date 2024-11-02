import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [
    NzLayoutModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    CommonModule,
    NzSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './security.component.html',
  styleUrl: './security.component.css',
})
export class SecurityComponent implements OnInit {
  selectedUserId!: number;
  passwordForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.selectedUserId = +userId;
    } else {
      console.error('Usuário não autenticado.');
      this.router.navigate(['/login']);
    }

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  changePassword(): void {
    if (
      this.passwordForm.value.newPassword !==
      this.passwordForm.value.confirmPassword
    ) {
      this.message.warning('A nova senha e a confirmação não correspondem.');
      return;
    }

    const { oldPassword, newPassword } = this.passwordForm.value;
    this.authService
      .changePassword(this.selectedUserId, oldPassword, newPassword)
      .subscribe({
        next: () => {
          this.message.success('Senha editada com sucesso!');
          this.router.navigate(['/welcome']);
        },
        error: () => {
          this.message.error('Erro ao editar senha. Tente novamente.');
        },
      });
  }
}
