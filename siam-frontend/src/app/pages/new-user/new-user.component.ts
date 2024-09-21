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
    FormsModule],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css'
})
export class NewUserComponent {

  frequencias: any[] = [{ administrationTime: '', frequency: '' }];

  adicionarFrequencia() {
    this.frequencias.push({ administrationTime: '', frequency: '' });
  }

  removerFrequencia(index: number) {
    this.frequencias.splice(index, 1);
  }

}
