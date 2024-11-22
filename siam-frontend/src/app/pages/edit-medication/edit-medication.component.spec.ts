import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMedicationComponent } from './edit-medication.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('EditMedicationComponent', () => {
  let component: EditMedicationComponent;
  let fixture: ComponentFixture<EditMedicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMedicationComponent, HttpClientModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
