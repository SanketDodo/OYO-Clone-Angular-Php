import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingReceiptPageComponent } from './booking-receipt-page.component';

describe('BookingReceiptPageComponent', () => {
  let component: BookingReceiptPageComponent;
  let fixture: ComponentFixture<BookingReceiptPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingReceiptPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingReceiptPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
