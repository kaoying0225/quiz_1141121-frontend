import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chart04Component } from './chart04.component';

describe('Chart04Component', () => {
  let component: Chart04Component;
  let fixture: ComponentFixture<Chart04Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chart04Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chart04Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
