import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NgxMaskConfig, provideEnvironmentNgxMask } from 'ngx-mask';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

const maskConfig: Partial<NgxMaskConfig> = {
  validation: true,
};

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let messageServiceMock: jasmine.SpyObj<NzMessageService>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['register']);
    messageServiceMock = jasmine.createSpyObj('NzMessageService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        SignupComponent,
        ReactiveFormsModule,
        NzButtonModule,
        NzFormModule,
        NzInputModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: NzMessageService, useValue: messageServiceMock },
        provideEnvironmentNgxMask(maskConfig),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the signup form', () => {
    expect(component.signupForm).toBeDefined();
    expect(component.signupForm.controls['fullName']).toBeDefined();
    expect(component.signupForm.controls['email']).toBeDefined();
    expect(component.signupForm.controls['username']).toBeDefined();
    expect(component.signupForm.controls['password']).toBeDefined();
  });

  it('should show an error message if the form is invalid on submit', () => {
    spyOn(console, 'error');
    component.signupForm.controls['fullName'].setValue('');
    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Formulário inválido!');
    expect(authServiceMock.register).not.toHaveBeenCalled();
  });
  
});
