import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditGuestComponent } from './admin-edit-guest.component';

describe('AdminEditGuestComponent', () => {
  let component: AdminEditGuestComponent;
  let fixture: ComponentFixture<AdminEditGuestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminEditGuestComponent]
    });
    fixture = TestBed.createComponent(AdminEditGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
