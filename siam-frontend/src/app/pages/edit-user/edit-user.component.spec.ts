import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserComponent } from './edit-user.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskConfig, provideEnvironmentNgxMask } from 'ngx-mask'

const maskConfig: Partial<NgxMaskConfig> = {
  validation: true,
};

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUserComponent, HttpClientModule, RouterTestingModule],
      providers: [provideEnvironmentNgxMask(maskConfig),],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
