import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgbPage } from './agb.page';

describe('AgbPage', () => {
  let component: AgbPage;
  let fixture: ComponentFixture<AgbPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AgbPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
