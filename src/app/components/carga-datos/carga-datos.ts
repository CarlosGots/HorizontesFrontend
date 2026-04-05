import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-carga-datos',
  imports: [CommonModule, FormsModule],
  templateUrl: './carga-datos.html',
  styleUrl: './carga-datos.css'
})
export class CargaDatos {

  archivo: File | null = null;
  cargando = false;
  resultado: any = null;
  error = '';

  constructor(private http: HttpClient) {}

  seleccionarArchivo(event: any) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.txt')) {
      this.archivo = file;
      this.error = '';
    } else {
      this.error = 'Solo se permiten archivos .txt';
      this.archivo = null;
    }
  }

  cargar() {
    if (!this.archivo) {
      this.error = 'Seleccioná un archivo primero';
      return;
    }
    this.cargando = true;
    this.resultado = null;
    this.error = '';

    const formData = new FormData();
    formData.append('archivo', this.archivo);

    this.http.post('http://localhost:8080/HorizontesBackend/api/carga', formData).subscribe({
      next: (res) => {
        this.resultado = res;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al procesar el archivo';
        this.cargando = false;
      }
    });
  }

  limpiar() {
    this.archivo = null;
    this.resultado = null;
    this.error = '';
  }

  instrucciones = [
    { tipo: 'USUARIO(...)', desc: 'Registra un usuario del sistema' },
    { tipo: 'DESTINO(...)', desc: 'Registra un destino turístico' },
    { tipo: 'PROVEEDOR(...)', desc: 'Registra un proveedor de servicios' },
    { tipo: 'PAQUETE(...)', desc: 'Registra un paquete turístico' },
    { tipo: 'SERVICIO_PAQUETE(...)', desc: 'Asigna un servicio a un paquete' },
    { tipo: 'CLIENTE(...)', desc: 'Registra un cliente' },
    { tipo: 'RESERVACION(...)', desc: 'Registra una reservación' },
    { tipo: 'PAGO(...)', desc: 'Registra un pago sobre una reservación' }
  ];

} // ← este es el cierre de la clase