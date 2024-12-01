import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NzIconModule } from 'ng-zorro-antd/icon';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, NzIconModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
