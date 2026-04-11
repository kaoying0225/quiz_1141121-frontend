import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillConfirmComponent } from './fill-confirm.component';

describe('FillConfirmComponent', () => {
  let component: FillConfirmComponent;
  let fixture: ComponentFixture<FillConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FillConfirmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FillConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
