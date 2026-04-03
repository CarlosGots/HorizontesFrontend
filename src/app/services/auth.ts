import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://localhost:8080/HorizontesBackend/api';

  constructor(private http: HttpClient) {}

  login(nombre: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/login`, { nombre, password });
  }

  logout(): Observable<any> {
    return this.http.delete(`${this.url}/login`);
  }

  getUsuarioSesion(): any {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  guardarSesion(usuario: any): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
  }

  estaLogueado(): boolean {
    return localStorage.getItem('usuario') !== null;
  }

  getTipo(): number {
    const u = this.getUsuarioSesion();
    return u ? u.tipo : 0;
  }
}