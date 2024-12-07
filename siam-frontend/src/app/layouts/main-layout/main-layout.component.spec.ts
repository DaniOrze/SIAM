import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLayoutComponent } from './main-layout.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NzIconModule } from 'ng-zorro-antd/icon';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent, HttpClientModule, RouterTestingModule, NzIconModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear localStorage and navigate to /login on logout', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const localStorageRemoveSpy = spyOn(localStorage, 'removeItem');
  
    component.logout();
  
    expect(localStorageRemoveSpy).toHaveBeenCalledWith('token');
    expect(localStorageRemoveSpy).toHaveBeenCalledWith('userId');
  
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });
  
});
