import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertsComponent } from './alerts.component';
import { AlertService } from '../../services/alert.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Alert } from '../../models/alert.model';

describe('AlertsComponent', () => {
  let component: AlertsComponent;
  let fixture: ComponentFixture<AlertsComponent>;
  let alertServiceMock: jasmine.SpyObj<AlertService>;
  let messageServiceMock: jasmine.SpyObj<NzMessageService>;

  beforeEach(async () => {
    alertServiceMock = jasmine.createSpyObj('AlertService', [
      'getAlerts',
      'deleteAlert',
    ]);
    messageServiceMock = jasmine.createSpyObj('NzMessageService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [AlertsComponent, RouterTestingModule],
      providers: [
        { provide: AlertService, useValue: alertServiceMock },
        { provide: NzMessageService, useValue: messageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertsComponent);
    component = fixture.componentInstance;

    alertServiceMock.getAlerts.and.returnValue(
      of([
        { id: 1, name: 'Alerta 1', playCount: 3, isActive: true },
        { id: 2, name: 'Alerta 2', playCount: 5, isActive: false },
      ])
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load alerts on init', () => {
    expect(alertServiceMock.getAlerts).toHaveBeenCalled();
    expect(component.alerts.length).toBe(2);
    expect(component.alerts[0].name).toBe('Alerta 1');
  });

  it('should handle error when loading alerts', () => {
    const errorResponse = new Error('Erro ao carregar alertas');
    spyOn(console, 'error');

    alertServiceMock.getAlerts.and.returnValue(throwError(() => errorResponse));
    component.loadAlerts();

    expect(console.error).toHaveBeenCalledWith(
      'Erro ao obter alertas:',
      errorResponse
    );
  });

  it('should open delete modal', () => {
    const alert: Alert = {
      id: 1,
      name: 'Alerta 1',
      playCount: 3,
      isActive: true,
    };
    component.openDeleteModal(alert);

    expect(component.selectedAlert).toBe(alert);
    expect(component.isDeleteModalVisible).toBeTrue();
  });

  it('should close delete modal on cancel', () => {
    component.handleCancel();
    expect(component.isDeleteModalVisible).toBeFalse();
  });

  it('should navigate to edit alert', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    const alert: Alert = {
      id: 1,
      name: 'Alerta 1',
      playCount: 3,
      isActive: true,
    };

    component.editarAlert(alert);

    expect(navigateSpy).toHaveBeenCalledWith(['/edit-alert', alert.id]);
  });

  it('should delete an alert successfully', () => {
    const alert: Alert = {
      id: 1,
      name: 'Alerta 1',
      playCount: 3,
      isActive: true,
    };
    component.alerts = [alert];
    component.selectedAlert = alert;

    alertServiceMock.deleteAlert.and.returnValue(of(void 0));

    component.confirmarDelete();

    expect(alertServiceMock.deleteAlert).toHaveBeenCalledWith(alert.id!);
    expect(component.alerts).not.toContain(alert);
    expect(messageServiceMock.success).toHaveBeenCalledWith(
      'Alerta excluído com sucesso!'
    );
    expect(component.isDeleteModalVisible).toBeFalse();
    expect(component.selectedAlert).toBeNull();
  });

  it('should handle error when deleting an alert', () => {
    const alert: Alert = {
      id: 1,
      name: 'Alerta 1',
      playCount: 3,
      isActive: true,
    };
    component.alerts = [alert];
    component.selectedAlert = alert;

    const errorResponse = new Error('Erro ao excluir alerta');
    alertServiceMock.deleteAlert.and.returnValue(
      throwError(() => errorResponse)
    );

    spyOn(console, 'error');

    component.confirmarDelete();

    expect(alertServiceMock.deleteAlert).toHaveBeenCalledWith(alert.id!);
    expect(console.error).toHaveBeenCalledWith(
      'Erro ao deletar alerta:',
      errorResponse
    );
    expect(messageServiceMock.error).toHaveBeenCalledWith(
      'Erro ao excluir o alerta. Tente novamente.'
    );
    expect(component.isDeleteModalVisible).toBeFalse();
  });

  it('should log an error and return if alert ID is undefined', () => {
    const alert: Alert = {
      name: 'Alerta sem ID',
      playCount: 3,
      isActive: true,
    };
    component.selectedAlert = alert;

    spyOn(console, 'error');

    component.confirmarDelete();

    expect(console.error).toHaveBeenCalledWith(
      'ID do alerta não está definido.'
    );
    expect(alertServiceMock.deleteAlert).not.toHaveBeenCalled();
  });
});
