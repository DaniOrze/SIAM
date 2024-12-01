import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsComponent } from './alerts.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NzIconModule } from 'ng-zorro-antd/icon';

describe('AlertsComponent', () => {
  let component: AlertsComponent;
  let fixture: ComponentFixture<AlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertsComponent, HttpClientModule, RouterTestingModule, NzIconModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
