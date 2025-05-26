import { Injectable, signal } from '@angular/core';
import { Usuario } from '@usuarios/intefaces';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private _usuarios = signal<Usuario[]>([]);

  get usuarios() {
    return this._usuarios;
  }

  actualizarRolUsuario(idUsuario: number, rolId: number) {}
}
