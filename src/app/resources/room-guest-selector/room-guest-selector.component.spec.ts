import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomGuestSelectorComponent } from './room-guest-selector.component';

describe('RoomGuestSelectorComponent', () => {
  let component: RoomGuestSelectorComponent;
  let fixture: ComponentFixture<RoomGuestSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomGuestSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomGuestSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
