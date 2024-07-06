import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestOrdersComponent } from './guest-orders.component';

describe('GuestOrdersComponent', () => {
  let component: GuestOrdersComponent;
  let fixture: ComponentFixture<GuestOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuestOrdersComponent]
    });
    fixture = TestBed.createComponent(GuestOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
