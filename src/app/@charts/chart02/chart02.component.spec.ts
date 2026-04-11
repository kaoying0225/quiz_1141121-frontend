import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chart02Component } from './chart02.component';

describe('Chart02Component', () => {
  let component: Chart02Component;
  let fixture: ComponentFixture<Chart02Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chart02Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chart02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
