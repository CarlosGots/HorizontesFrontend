import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private url = 'http://localhost:8080/HorizontesBackend/api/pagos';

  constructor(private http: HttpClient) {}

  listarPorReservacion(reservacionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}?reservacion=${reservacionId}`);
  }

  registrar(pago: any): Observable<any> {
    return this.http.post(this.url, pago);
  }

  descargarComprobante(reservacionId: number): void {
    window.open(
      `http://localhost:8080/HorizontesBackend/api/pagos?comprobante=${reservacionId}`,
      '_blank'
    );
  }
}