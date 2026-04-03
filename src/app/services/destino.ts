import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DestinoService {

  private url = 'http://localhost:8080/HorizontesBackend/api/destinos';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  crear(destino: any): Observable<any> {
    return this.http.post(this.url, destino);
  }

  actualizar(destino: any): Observable<any> {
    return this.http.put(this.url, destino);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}