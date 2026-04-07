import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CancelacionService } from '../../services/cancelacion';
import { ReservacionService } from '../../services/reservacion';

@Component({
  selector: 'app-cancelaciones',
  imports: [CommonModule, FormsModule],
  templateUrl: './cancelaciones.html',
  styleUrl: './cancelaciones.css'
})
export class Cancelaciones {

  reservacion: any = null;
  resultado: any = null;
  cargando = false;
  mensaje = '';
  error = '';
  busquedaNumero = '';

  constructor(
    private cancelacionService: CancelacionService,
    private reservacionService: ReservacionService
  ) {}
/** Busca una reservación por número para procesarle la cancelación */
  buscarReservacion() {
    if (!this.busquedaNumero) return;
    this.reservacion = null;
    this.resultado = null;
    this.error = '';
    this.reservacionService.listar().subscribe({
      next: (lista) => {
        const r = lista.find((x: any) =>
          x.numero.toLowerCase() === this.busquedaNumero.toLowerCase());
        if (r) {
          this.reservacion = r;
        } else {
          this.error = 'Reservación no encontrada';
        }
      }
    });
  }
/** 
 * Procesa la cancelación verificando el estado y los días de anticipación.
 * El porcentaje de reembolso se calcula automáticamente en el backend.
 */
  procesarCancelacion() {
    if (!this.reservacion) return;
    if (!confirm(`¿Estás seguro de cancelar la reservación ${this.reservacion.numero}?`)) return;

    this.cargando = true;
    this.cancelacionService.cancelar(this.reservacion.id).subscribe({
      next: (res) => {
        this.resultado = res;
        this.mensaje = 'Reservación cancelada correctamente';
        this.cargando = false;
        this.reservacion.estado = 'CANCELADA';
      },
      error: (e) => {
        this.error = e.error?.error || 'Error al procesar la cancelación';
        this.cargando = false;
      }
    });
  }
/** Retorna el color del badge según el estado de la reservación */
  getColorEstado(estado: string): string {
    switch(estado) {
      case 'CONFIRMADA': return 'success';
      case 'PENDIENTE': return 'warning';
      case 'CANCELADA': return 'danger';
      case 'COMPLETADA': return 'info';
      default: return 'secondary';
    }
  }
/** Limpia el formulario para iniciar una nueva consulta */ 
  limpiar() {
    this.reservacion = null;
    this.resultado = null;
    this.busquedaNumero = '';
    this.mensaje = '';
    this.error = '';
  }
}