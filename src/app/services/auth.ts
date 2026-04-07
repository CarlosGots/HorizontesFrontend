import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Servicio de autenticación.
 * Maneja el login, logout y el almacenamiento de la sesión del usuario
 * en el localStorage del navegador.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://localhost:8080/HorizontesBackend/api';

  constructor(private http: HttpClient) {}

  /** Envía las credenciales al backend para iniciar sesión */
  login(nombre: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/login`, { nombre, password });
  }

  /** Cierra la sesión en el backend */
  logout(): Observable<any> {
    return this.http.delete(`${this.url}/login`);
  }

  /** Obtiene el usuario guardado en localStorage */
  getUsuarioSesion(): any {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  /** Guarda el usuario en localStorage después del login exitoso */
  guardarSesion(usuario: any): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  /** Elimina el usuario del localStorage al cerrar sesión */
  cerrarSesion(): void {
    localStorage.removeItem('usuario');
  }

  /** Verifica si hay un usuario activo en la sesión */
  estaLogueado(): boolean {
    return localStorage.getItem('usuario') !== null;
  }

  /** Retorna el tipo/rol del usuario activo (1, 2 o 3) */
  getTipo(): number {
    const u = this.getUsuarioSesion();
    return u ? u.tipo : 0;
  }
}