import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MySearchPage } from './my-search.page';

describe('MySearchPage', () => {
  let component: MySearchPage;
  let fixture: ComponentFixture<MySearchPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MySearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
