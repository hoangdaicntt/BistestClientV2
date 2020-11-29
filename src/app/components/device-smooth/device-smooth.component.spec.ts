import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSmoothComponent } from './device-smooth.component';

describe('DeviceSmoothComponent', () => {
  let component: DeviceSmoothComponent;
  let fixture: ComponentFixture<DeviceSmoothComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceSmoothComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSmoothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
