import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceUnmixComponent } from './device-unmix.component';

describe('DeviceUnmixComponent', () => {
  let component: DeviceUnmixComponent;
  let fixture: ComponentFixture<DeviceUnmixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceUnmixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceUnmixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
