import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringComponent } from './monitoring.component';
import { HttpClientModule } from '@angular/common/http';
import { NGX_ECHARTS_CONFIG } from 'ngx-echarts';

describe('MonitoringComponent', () => {
  let component: MonitoringComponent;
  let fixture: ComponentFixture<MonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoringComponent, HttpClientModule],
      providers: [
        {
          provide: NGX_ECHARTS_CONFIG,
          useValue: {},
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
