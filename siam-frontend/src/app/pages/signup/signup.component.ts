import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

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
    RouterOutlet
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

}
