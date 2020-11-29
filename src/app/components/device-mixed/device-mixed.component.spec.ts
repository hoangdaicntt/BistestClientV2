import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceMixedComponent } from './device-mixed.component';

describe('DeviceMixedComponent', () => {
  let component: DeviceMixedComponent;
  let fixture: ComponentFixture<DeviceMixedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceMixedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceMixedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
