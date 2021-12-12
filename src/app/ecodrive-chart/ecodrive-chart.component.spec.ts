import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcodriveChartComponent } from './ecodrive-chart.component';

describe('EcodriveChartComponent', () => {
  let component: EcodriveChartComponent;
  let fixture: ComponentFixture<EcodriveChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcodriveChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcodriveChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
