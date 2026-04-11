import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizFillComponent } from './quiz-fill.component';

describe('QuizFillComponent', () => {
  let component: QuizFillComponent;
  let fixture: ComponentFixture<QuizFillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizFillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizFillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
