import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelListingPageComponent } from './hotel-listing-page.component';

describe('HotelListingPageComponent', () => {
  let component: HotelListingPageComponent;
  let fixture: ComponentFixture<HotelListingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelListingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelListingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
