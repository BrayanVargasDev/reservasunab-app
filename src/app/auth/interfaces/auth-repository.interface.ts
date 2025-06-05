import { CredencialesLogin } from "./credenciales-login.interface";
import { LoginResponse } from "./login-response.interface";
import { UsuarioLogueado } from "./usuario-logueado.interface";

export interface RepositorioAutenticacionInterface {
  login(credenciales: CredencialesLogin): Promise<LoginResponse>;
  logout(): Promise<void>;
  checkAuthStatus(): Promise<UsuarioLogueado | null>;
}
