import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservasMainPage } from './reservas-main.page';

describe('ReservasMainPage', () => {
  let component: ReservasMainPage;
  let fixture: ComponentFixture<ReservasMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservasMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
