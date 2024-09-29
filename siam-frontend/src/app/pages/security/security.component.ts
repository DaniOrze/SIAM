import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms'; 

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
    FormsModule
  ],
  templateUrl: './security.component.html',
  styleUrl: './security.component.css'
})
export class SecurityComponent {

  users = [
    { id: 1, name: 'Usuário 1' },
    { id: 2, name: 'Usuário 2' },
    // Adicione mais usuários conforme necessário
  ];

}
