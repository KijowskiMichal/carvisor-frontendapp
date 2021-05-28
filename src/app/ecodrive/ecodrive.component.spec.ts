import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcodriveComponent } from './ecodrive.component';

describe('EcodriveComponent', () => {
  let component: EcodriveComponent;
  let fixture: ComponentFixture<EcodriveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcodriveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcodriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
