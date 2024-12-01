import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskConfig, provideEnvironmentNgxMask } from 'ngx-mask'
import { RouterTestingModule } from '@angular/router/testing';

const maskConfig: Partial<NgxMaskConfig> = {
  validation: true,
};

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupComponent, HttpClientModule, RouterTestingModule],
      providers: [provideEnvironmentNgxMask(maskConfig),],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
