import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BListComponent } from './b-list.component';

describe('BListComponent', () => {
  let component: BListComponent;
  let fixture: ComponentFixture<BListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
