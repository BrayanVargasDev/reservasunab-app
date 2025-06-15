import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EspaciosMainPage } from './espacios-main.page';

describe('EspaciosMainPage', () => {
  let component: EspaciosMainPage;
  let fixture: ComponentFixture<EspaciosMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EspaciosMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
