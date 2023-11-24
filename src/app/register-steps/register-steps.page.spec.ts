import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterStepsPage } from './register-steps.page';

describe('RegisterStepsPage', () => {
  let component: RegisterStepsPage;
  let fixture: ComponentFixture<RegisterStepsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegisterStepsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
