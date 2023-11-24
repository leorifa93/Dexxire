import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartTabsPage } from './start-tabs.page';

describe('StartTabsPage', () => {
  let component: StartTabsPage;
  let fixture: ComponentFixture<StartTabsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StartTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
