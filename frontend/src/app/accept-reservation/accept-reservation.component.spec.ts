import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptReservationComponent } from './accept-reservation.component';

describe('AcceptReservationComponent', () => {
  let component: AcceptReservationComponent;
  let fixture: ComponentFixture<AcceptReservationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcceptReservationComponent]
    });
    fixture = TestBed.createComponent(AcceptReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
