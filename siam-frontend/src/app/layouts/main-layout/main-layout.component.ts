import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule, provideNzIconsPatch } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { DashboardOutline, FormOutline, NotificationOutline, MonitorOutline, FileTextOutline, UserOutline, SettingOutline, LogoutOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
  ],
  providers: [
    provideNzIconsPatch([DashboardOutline,
    FormOutline,
    NotificationOutline,
    MonitorOutline,
    FileTextOutline,
    UserOutline,
    SettingOutline,
    LogoutOutline,])],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  isCollapsed = false;

  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    this.router.navigate(['/login']);
  }
}
