import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyUserComponent } from './safety-user.component';

describe('SafetyUserComponent', () => {
  let component: SafetyUserComponent;
  let fixture: ComponentFixture<SafetyUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafetyUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
