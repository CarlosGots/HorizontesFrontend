import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservacionService {

  private url = 'http://localhost:8080/HorizontesBackend/api/reservaciones';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  listarDelDia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}?dia=hoy`);
  }

  listarPorCliente(clienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}?cliente=${clienteId}`);
  }

  obtener(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  crear(reservacion: any): Observable<any> {
    return this.http.post(this.url, reservacion);
  }

  actualizarEstado(id: number, estado: string): Observable<any> {
    return this.http.put(this.url, { id, estado });
  }
}