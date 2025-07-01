import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DreservasMainPage } from './dreservas-main.page';

describe('DreservasMainPage', () => {
  let component: DreservasMainPage;
  let fixture: ComponentFixture<DreservasMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DreservasMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
