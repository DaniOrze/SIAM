import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAlertComponent } from './new-alert.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('NewAlertComponent', () => {
  let component: NewAlertComponent;
  let fixture: ComponentFixture<NewAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAlertComponent, HttpClientModule, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NewAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
