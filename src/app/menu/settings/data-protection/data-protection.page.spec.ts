import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataProtectionPage } from './data-protection.page';

describe('DataProtectionPage', () => {
  let component: DataProtectionPage;
  let fixture: ComponentFixture<DataProtectionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DataProtectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
