import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url = 'http://localhost:8080/HorizontesBackend/api/usuarios';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  crear(usuario: any): Observable<any> {
    return this.http.post(this.url, usuario);
  }

  actualizar(usuario: any): Observable<any> {
    return this.http.put(this.url, usuario);
  }

  desactivar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}