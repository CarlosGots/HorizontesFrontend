import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Servicio de reservaciones.
 * Se comunica con el backend para crear, consultar y actualizar reservaciones.
 */
@Injectable({
  providedIn: 'root'
})
export class ReservacionService {

  private url = 'http://localhost:8080/HorizontesBackend/api/reservaciones';

  constructor(private http: HttpClient) {}

  /** Obtiene todas las reservaciones del sistema */
  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  /** Obtiene solo las reservaciones creadas hoy */
  listarDelDia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}?dia=hoy`);
  }

  /** Obtiene el historial de reservaciones de un cliente específico */
  listarPorCliente(clienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}?cliente=${clienteId}`);
  }

  /** Obtiene el detalle completo de una reservación incluyendo pasajeros */
  obtener(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  /** Crea una nueva reservación con sus pasajeros */
  crear(reservacion: any): Observable<any> {
    return this.http.post(this.url, reservacion);
  }

  /** Actualiza el estado de una reservación (PENDIENTE, CONFIRMADA, etc.) */
  actualizarEstado(id: number, estado: string): Observable<any> {
    return this.http.put(this.url, { id, estado });
  }
}