import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { pt_BR, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxEchartsModule } from 'ngx-echarts';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import {
  provideHttpClient,
  HTTP_INTERCEPTORS,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { DashboardOutline, FormOutline, NotificationOutline, MonitorOutline, FileTextOutline, UserOutline, SettingOutline, LogoutOutline, EditOutline, DeleteOutline } from '@ant-design/icons-angular/icons';

import { AuthInterceptor } from './interceptor/auth.interceptor';

registerLocaleData(pt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzIcons([
      DashboardOutline,
      FormOutline,
      NotificationOutline,
      MonitorOutline,
      FileTextOutline,
      UserOutline,
      SettingOutline,
      LogoutOutline,
      EditOutline,
      DeleteOutline
    ]),
    provideNzI18n(pt_BR),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    importProvidersFrom(
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'),
      })
    ),
    provideEnvironmentNgxMask(),
  ],
};
