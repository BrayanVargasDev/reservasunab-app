import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginPage,
        FormsModule,
        IonicModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty login data initially', () => {
    expect(component.loginData.email).toBe('');
    expect(component.loginData.password).toBe('');
  });

  it('should have a form with email and password inputs', () => {
    const emailInput = fixture.debugElement.query(By.css('ion-input[name="email"]'));
    const passwordInput = fixture.debugElement.query(By.css('ion-input[name="password"]'));

    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
  });

  it('should have a login button that calls onLogin', () => {
    spyOn(component, 'onLogin');
    const loginButton = fixture.debugElement.query(By.css('ion-button[type="submit"]'));
    expect(loginButton).toBeTruthy();

    loginButton.nativeElement.click();
    fixture.detectChanges();

    expect(component.onLogin).toHaveBeenCalled();
  });

  it('should have links to reset password and register pages', () => {
    const resetPasswordLink = fixture.debugElement.query(By.css('ion-button[routerLink="/auth/reset-password"]'));
    const registerLink = fixture.debugElement.query(By.css('ion-button[routerLink="/auth/registro"]'));

    expect(resetPasswordLink).toBeTruthy();
    expect(registerLink).toBeTruthy();
  });

  it('should update loginData when form inputs change', () => {
    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    const emailInput = fixture.debugElement.query(By.css('ion-input[name="email"]')).componentInstance;
    const passwordInput = fixture.debugElement.query(By.css('ion-input[name="password"]')).componentInstance;

    emailInput.value = testEmail;
    passwordInput.value = testPassword;

    emailInput.ionChange.emit({ detail: { value: testEmail } });
    passwordInput.ionChange.emit({ detail: { value: testPassword } });

    fixture.detectChanges();

    expect(component.loginData.email).toBe(testEmail);
    expect(component.loginData.password).toBe(testPassword);
  });

  it('should log login data when onLogin is called', () => {
    spyOn(console, 'log');
    component.loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    component.onLogin();

    expect(console.log).toHaveBeenCalledWith('Intentando iniciar sesión con:', component.loginData);
  });
});
