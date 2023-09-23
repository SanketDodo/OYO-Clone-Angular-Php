import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingShimmerComponent } from './booking-shimmer.component';

describe('BookingShimmerComponent', () => {
  let component: BookingShimmerComponent;
  let fixture: ComponentFixture<BookingShimmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingShimmerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingShimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
