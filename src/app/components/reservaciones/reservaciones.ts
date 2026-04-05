import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservacionService } from '../../services/reservacion';
import { PaqueteService } from '../../services/paquete';
import { ClienteService } from '../../services/cliente';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-reservaciones',
  imports: [CommonModule, FormsModule],
  templateUrl: './reservaciones.html',
  styleUrl: './reservaciones.css'
})
export class Reservaciones implements OnInit {

  reservaciones: any[] = [];
  mostrarFormulario = false;
  mostrarDetalle = false;
  cargando = false;
  mensaje = '';
  error = '';
  filtroDia = false;
  reservacionDetalle: any = null;

  paquetes: any[] = [];
  pasajeros: any[] = [];
  busquedaDpi = '';

  form: any = {
    paqueteId: null,
    fechaViaje: '',
    pasajeros: []
  };

  constructor(
    private reservacionService: ReservacionService,
    private paqueteService: PaqueteService,
    private clienteService: ClienteService,
    private authService: AuthService
  ) {}

ngOnInit() {
  this.cargar();
  this.paqueteService.listar().subscribe(p => this.paquetes = p.filter((x: any) => x.activo));
}

  cargar() {
    const obs = this.filtroDia
      ? this.reservacionService.listarDelDia()
      : this.reservacionService.listar();
    obs.subscribe({
      next: (data) => this.reservaciones = data,
      error: () => this.error = 'Error al cargar reservaciones'
    });
  }

  toggleFiltroDia() {
    this.filtroDia = !this.filtroDia;
    this.cargar();
  }

  nuevo() {
    this.form = { paqueteId: null, fechaViaje: '', pasajeros: [] };
    this.pasajeros = [];
    this.busquedaDpi = '';
    this.mostrarFormulario = true;
    this.mostrarDetalle = false;
    this.mensaje = '';
    this.error = '';
  }

  buscarPasajero() {
    if (!this.busquedaDpi) return;
    this.clienteService.buscarPorDpi(this.busquedaDpi).subscribe({
      next: (c) => {
        if (this.pasajeros.find(p => p.dpi === c.dpi)) {
          this.error = 'Este pasajero ya fue agregado';
          return;
        }
        this.pasajeros.push(c);
        this.form.pasajeros = this.pasajeros;
        this.busquedaDpi = '';
        this.error = '';
      },
      error: () => this.error = 'Cliente no encontrado con ese DPI'
    });
  }

  eliminarPasajero(index: number) {
    this.pasajeros.splice(index, 1);
    this.form.pasajeros = this.pasajeros;
  }

  getPaqueteSeleccionado(): any {
    return this.paquetes.find(p => p.id == this.form.paqueteId);
  }

  getCostoTotal(): number {
    const paquete = this.getPaqueteSeleccionado();
    if (!paquete) return 0;
    return paquete.precioVenta * this.pasajeros.length;
  }

  verDetalle(r: any) {
    this.reservacionService.obtener(r.id).subscribe({
      next: (data) => {
        this.reservacionDetalle = data;
        this.mostrarDetalle = true;
        this.mostrarFormulario = false;
      }
    });
  }

  guardar() {
    if (!this.form.paqueteId || !this.form.fechaViaje || this.pasajeros.length === 0) {
      this.error = 'Paquete, fecha de viaje y al menos un pasajero son obligatorios';
      return;
    }
    this.cargando = true;
    const usuario = this.authService.getUsuarioSesion();
    const reservacion = {
      paqueteId: this.form.paqueteId,
      fechaViaje: this.form.fechaViaje,
      agenteId: usuario.id,
      costoTotal: this.getCostoTotal(),
      pasajeros: this.pasajeros
    };

    this.reservacionService.crear(reservacion).subscribe({
      next: () => {
        this.mensaje = 'Reservación creada correctamente';
        this.mostrarFormulario = false;
        this.cargando = false;
        this.cargar();
      },
      error: () => {
        this.error = 'Error al crear la reservación';
        this.cargando = false;
      }
    });
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.mostrarDetalle = false;
    this.error = '';
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


