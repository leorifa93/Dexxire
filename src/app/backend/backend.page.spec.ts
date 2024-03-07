import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackendPage } from './backend.page';

describe('BackendPage', () => {
  let component: BackendPage;
  let fixture: ComponentFixture<BackendPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BackendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
