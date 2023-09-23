import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewShimmerComponent } from './view-shimmer.component';

describe('ViewShimmerComponent', () => {
  let component: ViewShimmerComponent;
  let fixture: ComponentFixture<ViewShimmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewShimmerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewShimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
