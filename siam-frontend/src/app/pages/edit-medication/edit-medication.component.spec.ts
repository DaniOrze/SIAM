import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMedicationComponent } from './edit-medication.component';

describe('EditMedicationComponent', () => {
  let component: EditMedicationComponent;
  let fixture: ComponentFixture<EditMedicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMedicationComponent]
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
