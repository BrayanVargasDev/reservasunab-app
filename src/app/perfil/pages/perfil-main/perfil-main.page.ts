import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-perfil-main',
  templateUrl: './perfil-main.page.html',
  styleUrls: ['./perfil-main.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class PerfilMainPage implements OnInit {
  perfilForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.perfilForm = this.fb.group({
      nombre: ['Usuario Ejemplo', Validators.required],
      email: ['usuario@ejemplo.com', [Validators.required, Validators.email]],
      telefono: ['123456789', Validators.required],
      direccion: ['Calle Principal #123', Validators.required],
    });
  }

  guardarCambios() {
    if (this.perfilForm.valid) {
      console.log('Guardando datos del perfil:', this.perfilForm.value);
      // Aquí iría la lógica para guardar en el backend
    } else {
      this.perfilForm.markAllAsTouched();
    }
  }

  esCampoInvalido(campo: string): boolean {
    return (
      (this.perfilForm.get(campo)?.invalid &&
        this.perfilForm.get(campo)?.touched) ||
      false
    );
  }
}
