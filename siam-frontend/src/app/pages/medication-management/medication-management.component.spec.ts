import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationManagementComponent } from './medication-management.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NzIconModule } from 'ng-zorro-antd/icon';

describe('MedicationManagementComponent', () => {
  let component: MedicationManagementComponent;
  let fixture: ComponentFixture<MedicationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationManagementComponent, HttpClientModule, RouterTestingModule, NzIconModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
