import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private url = 'http://localhost:8080/HorizontesBackend/api/clientes';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  buscarPorDpi(dpi: string): Observable<any> {
    return this.http.get<any>(`${this.url}?dpi=${dpi}`);
  }

  crear(cliente: any): Observable<any> {
    return this.http.post(this.url, cliente);
  }

  actualizar(cliente: any): Observable<any> {
    return this.http.put(this.url, cliente);
  }
}