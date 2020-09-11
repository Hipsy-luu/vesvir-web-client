import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsStatsComponent } from './reviews-stats.component';

describe('ReviewsStatsComponent', () => {
  let component: ReviewsStatsComponent;
  let fixture: ComponentFixture<ReviewsStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewsStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
