import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidDataComponent } from './covid-data.component';

describe('CovidDataComponent', () => {
  let component: CovidDataComponent;
  let fixture: ComponentFixture<CovidDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CovidDataComponent]
    });
    fixture = TestBed.createComponent(CovidDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
