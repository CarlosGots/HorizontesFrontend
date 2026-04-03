import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaqueteService {

  private url = 'http://localhost:8080/HorizontesBackend/api/paquetes';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  listarPorDestino(destinoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}?destino=${destinoId}`);
  }

  obtener(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  crear(paquete: any): Observable<any> {
    return this.http.post(this.url, paquete);
  }

  actualizar(paquete: any): Observable<any> {
    return this.http.put(this.url, paquete);
  }

  desactivar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}