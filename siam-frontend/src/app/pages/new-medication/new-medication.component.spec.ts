import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMedicationComponent } from './new-medication.component';

describe('NewMedicationComponent', () => {
  let component: NewMedicationComponent;
  let fixture: ComponentFixture<NewMedicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewMedicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
