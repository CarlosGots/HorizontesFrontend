import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService } from '../../services/pago';
import { ReservacionService } from '../../services/reservacion';

@Component({
  selector: 'app-pagos',
  imports: [CommonModule, FormsModule],
  templateUrl: './pagos.html',
  styleUrl: './pagos.css'
})
export class Pagos implements OnInit {

  pagos: any[] = [];
  reservacion: any = null;
  cargando = false;
  mensaje = '';
  error = '';
  busquedaNumero = '';

  metodos = [
    { id: 1, nombre: 'Efectivo' },
    { id: 2, nombre: 'Tarjeta' },
    { id: 3, nombre: 'Transferencia' }
  ];

  form: any = {
    reservacionId: null,
    monto: 0,
    metodo: 1,
    fecha: new Date().toISOString().split('T')[0]
  };

  constructor(
    private pagoService: PagoService,
    private reservacionService: ReservacionService
  ) {}

  ngOnInit() {}
/** Busca una reservación por su número (ej: RES-00001) */
  buscarReservacion() {
    if (!this.busquedaNumero) return;
    this.reservacion = null;
    this.pagos = [];
    this.error = '';
    this.reservacionService.listar().subscribe({
      next: (lista) => {
        const r = lista.find((x: any) =>
          x.numero.toLowerCase() === this.busquedaNumero.toLowerCase());
        if (r) {
          this.reservacion = r;
          this.form.reservacionId = r.id;
          this.form.monto = r.costoTotal;
          this.cargarPagos(r.id);
        } else {
          this.error = 'Reservación no encontrada';
        }
      }
    });
  }
/** Carga el historial de pagos de una reservación */
  cargarPagos(reservacionId: number) {
    this.pagoService.listarPorReservacion(reservacionId).subscribe({
      next: (data) => this.pagos = data,
      error: () => this.error = 'Error al cargar pagos'
    });
  }
/** Calcula el total de pagos ya registrados */
  getTotalPagado(): number {
    return this.pagos.reduce((sum, p) => sum + p.monto, 0);
  }
/** Calcula el monto que aún falta por pagar */
  getPendiente(): number {
    if (!this.reservacion) return 0;
    return this.reservacion.costoTotal - this.getTotalPagado();
  }
/** Registra un pago y verifica si la reservación queda confirmada */
  registrarPago() {
    if (!this.form.reservacionId || this.form.monto <= 0) {
      this.error = 'Ingresá un monto válido';
      return;
    }
    if (this.form.monto > this.getPendiente()) {
      this.error = 'El monto no puede superar el saldo pendiente';
      return;
    }
    this.cargando = true;
    this.pagoService.registrar(this.form).subscribe({
      next: (res) => {
        this.mensaje = res.confirmada
          ? '¡Pago registrado! La reservación quedó CONFIRMADA'
          : `Pago registrado. Pendiente: Q. ${res.pendiente?.toFixed(2)}`;
        this.cargando = false;
        this.cargarPagos(this.form.reservacionId);
        this.reservacionService.listar().subscribe(lista => {
          const r = lista.find((x: any) => x.id === this.form.reservacionId);
          if (r) this.reservacion = r;
        });
      },
      error: () => {
        this.error = 'Error al registrar el pago';
        this.cargando = false;
      }
    });
  }
/** Abre el comprobante de pago en PDF en una nueva pestaña */
  descargarComprobante() {
    if (!this.reservacion) return;
    this.pagoService.descargarComprobante(this.reservacion.id);
  }

  getMetodoNombre(id: number): string {
    return this.metodos.find(m => m.id === id)?.nombre || '—';
  }

  getColorEstado(estado: string): string {
    switch(estado) {
      case 'CONFIRMADA': return 'success';
      case 'PENDIENTE': return 'warning';
      case 'CANCELADA': return 'danger';
      case 'COMPLETADA': return 'info';
      default: return 'secondary';
    }
  }
}