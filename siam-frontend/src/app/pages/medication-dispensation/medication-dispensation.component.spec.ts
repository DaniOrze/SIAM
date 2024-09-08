import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationDispensationComponent } from './medication-dispensation.component';

describe('MedicationDispensationComponent', () => {
  let component: MedicationDispensationComponent;
  let fixture: ComponentFixture<MedicationDispensationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationDispensationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicationDispensationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
