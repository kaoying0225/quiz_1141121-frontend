import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chart01Component } from './chart01.component';

describe('Chart01Component', () => {
  let component: Chart01Component;
  let fixture: ComponentFixture<Chart01Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chart01Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chart01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
