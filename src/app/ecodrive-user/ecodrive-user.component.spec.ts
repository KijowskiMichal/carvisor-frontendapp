import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcodriveUserComponent } from './ecodrive-user.component';

describe('EcodriveUserComponent', () => {
  let component: EcodriveUserComponent;
  let fixture: ComponentFixture<EcodriveUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcodriveUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcodriveUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
