import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CancelacionService {

  private url = 'http://localhost:8080/HorizontesBackend/api/cancelaciones';

  constructor(private http: HttpClient) {}

  cancelar(reservacionId: number): Observable<any> {
    return this.http.post(this.url, { reservacionId });
  }
}