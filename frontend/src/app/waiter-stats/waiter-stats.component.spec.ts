import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterStatsComponent } from './waiter-stats.component';

describe('WaiterStatsComponent', () => {
  let component: WaiterStatsComponent;
  let fixture: ComponentFixture<WaiterStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaiterStatsComponent]
    });
    fixture = TestBed.createComponent(WaiterStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
