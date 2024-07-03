import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGuestListComponent } from './admin-guest-list.component';

describe('AdminGuestListComponent', () => {
  let component: AdminGuestListComponent;
  let fixture: ComponentFixture<AdminGuestListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminGuestListComponent]
    });
    fixture = TestBed.createComponent(AdminGuestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
