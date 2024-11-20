import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserComponent } from './new-user.component';
import { HttpClientModule } from '@angular/common/http';
import { provideNgxMask, IConfig } from 'ngx-mask';

const maskConfig: Partial<IConfig> = {
  validation: true,
};

describe('NewUserComponent', () => {
  let component: NewUserComponent;
  let fixture: ComponentFixture<NewUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewUserComponent, HttpClientModule],
      providers: [provideNgxMask(maskConfig)], 
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
