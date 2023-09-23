import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListShimmerComponent } from './list-shimmer.component';

describe('ListShimmerComponent', () => {
  let component: ListShimmerComponent;
  let fixture: ComponentFixture<ListShimmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListShimmerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListShimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
