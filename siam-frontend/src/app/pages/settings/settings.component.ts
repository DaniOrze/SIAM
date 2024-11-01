import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, NzGridModule, NzCardModule, NzButtonModule, RouterLink, RouterOutlet],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  userId: number | null = null;

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    this.userId = storedUserId ? parseInt(storedUserId) : null;
  }
}