import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private url = 'http://localhost:8080/HorizontesBackend/api/reportes';

  constructor(private http: HttpClient) {}

  getVentas(inicio?: string, fin?: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/ventas${this.buildParams(inicio, fin)}`);
  }

  getCancelaciones(inicio?: string, fin?: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/cancelaciones${this.buildParams(inicio, fin)}`);
  }

  getGanancias(inicio?: string, fin?: string): Observable<any> {
    return this.http.get<any>(`${this.url}/ganancias${this.buildParams(inicio, fin)}`);
  }

  getAgenteVentas(inicio?: string, fin?: string): Observable<any> {
    return this.http.get<any>(`${this.url}/agente-ventas${this.buildParams(inicio, fin)}`);
  }

  getAgenteGanancias(inicio?: string, fin?: string): Observable<any> {
    return this.http.get<any>(`${this.url}/agente-ganancias${this.buildParams(inicio, fin)}`);
  }

  getPaquetesVentas(inicio?: string, fin?: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/paquetes-ventas${this.buildParams(inicio, fin)}`);
  }

  getOcupacionDestino(inicio?: string, fin?: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/ocupacion-destino${this.buildParams(inicio, fin)}`);
  }

  exportarPdf(tipo: string, inicio?: string, fin?: string): void {
    let params = this.buildParams(inicio, fin);
    params += params ? '&pdf=true' : '?pdf=true';
    window.open(`${this.url}/${tipo}${params}`, '_blank');
  }

  private buildParams(inicio?: string, fin?: string): string {
    const p = [];
    if (inicio) p.push(`inicio=${inicio}`);
    if (fin) p.push(`fin=${fin}`);
    return p.length ? '?' + p.join('&') : '';
  }
}