import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SignupComponent } from './pages/signup/signup.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: '/welcome', pathMatch: 'full' },
      {
        path: 'welcome',
        loadComponent: () =>
          import('./pages/welcome/welcome.component').then(
            (m) => m.WelcomeComponent
          ),
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./pages/alerts/alerts.component').then(
            (m) => m.AlertsComponent
          ),
      },
      {
        path: 'monitoring',
        loadComponent: () =>
          import('./pages/monitoring/monitoring.component').then(
            (m) => m.MonitoringComponent
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports.component').then(
            (m) => m.ReportsComponent
          ),
      },
      {
        path: 'user-management',
        loadComponent: () =>
          import('./pages/user-management/user-management.component').then(
            (m) => m.UserManagementComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
      {
        path: 'new-user',
        loadComponent: () =>
          import('./pages/new-user/new-user.component').then(
            (m) => m.NewUserComponent
          ),
      },
      {
        path: 'medication-management',
        loadComponent: () =>
          import(
            './pages/medication-management/medication-management.component'
          ).then((m) => m.MedicationManagementComponent),
      },
      {
        path: 'new-medication',
        loadComponent: () =>
          import('./pages/new-medication/new-medication.component').then(
            (m) => m.NewMedicationComponent
          ),
      },
      {
        path: 'personal-info',
        loadComponent: () =>
          import('./pages/personal-info/personal-info.component').then(
            (m) => m.PersonalInfoComponent
          ),
      },
      {
        path: 'security',
        loadComponent: () =>
          import('./pages/security/security.component').then(
            (m) => m.SecurityComponent
          ),
      },
      {
        path: 'edit-medication/:id',
        loadComponent: () =>
          import('./pages/edit-medication/edit-medication.component').then(
            (m) => m.EditMedicationComponent
          ),
      },
    ],
  },
];
