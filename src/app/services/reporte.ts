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
    let params = this.buildParams(inicio, fin);
    return this.http.get<any[]>(`${this.url}/ventas${params}`);
  }

  getCancelaciones(inicio?: string, fin?: string): Observable<any[]> {
    let params = this.buildParams(inicio, fin);
    return this.http.get<any[]>(`${this.url}/cancelaciones${params}`);
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