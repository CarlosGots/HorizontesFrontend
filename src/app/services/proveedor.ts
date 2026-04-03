import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private url = 'http://localhost:8080/HorizontesBackend/api/proveedores';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  crear(proveedor: any): Observable<any> {
    return this.http.post(this.url, proveedor);
  }

  actualizar(proveedor: any): Observable<any> {
    return this.http.put(this.url, proveedor);
  }
}