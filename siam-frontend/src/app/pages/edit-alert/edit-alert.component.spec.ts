import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAlertComponent } from './edit-alert.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EditAlertComponent', () => {
  let component: EditAlertComponent;
  let fixture: ComponentFixture<EditAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAlertComponent, HttpClientModule, RouterTestingModule, BrowserAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
