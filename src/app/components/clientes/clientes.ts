import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente';
import { ReservacionService } from '../../services/reservacion';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {

  clientes: any[] = [];
  historial: any[] = [];
  clienteSeleccionado: any = null;
  mostrarFormulario = false;
  mostrarHistorial = false;
  editando = false;
  cargando = false;
  mensaje = '';
  error = '';
  busquedaDpi = '';

  form: any = {
    id: null, dpi: '', nombre: '', fechaNacimiento: '',
    telefono: '', email: '', nacionalidad: ''
  };

  constructor(
    private clienteService: ClienteService,
    private reservacionService: ReservacionService
  ) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.clienteService.listar().subscribe({
      next: (data) => this.clientes = data,
      error: () => this.error = 'Error al cargar clientes'
    });
  }

  buscarPorDpi() {
    if (!this.busquedaDpi) { this.cargar(); return; }
    this.clienteService.buscarPorDpi(this.busquedaDpi).subscribe({
      next: (c) => this.clientes = [c],
      error: () => {
        this.error = 'Cliente no encontrado';
        this.clientes = [];
      }
    });
  }

  nuevo() {
    this.form = { id: null, dpi: '', nombre: '', fechaNacimiento: '', telefono: '', email: '', nacionalidad: '' };
    this.editando = false;
    this.mostrarFormulario = true;
    this.mostrarHistorial = false;
    this.mensaje = '';
    this.error = '';
  }

  editar(c: any) {
    this.form = { ...c };
    this.editando = true;
    this.mostrarFormulario = true;
    this.mostrarHistorial = false;
    this.mensaje = '';
    this.error = '';
  }

  verHistorial(c: any) {
    this.clienteSeleccionado = c;
    this.mostrarHistorial = true;
    this.mostrarFormulario = false;
    this.reservacionService.listarPorCliente(c.id).subscribe({
      next: (data) => this.historial = data,
      error: () => this.error = 'Error al cargar historial'
    });
  }

  guardar() {
    if (!this.form.dpi || !this.form.nombre || !this.form.fechaNacimiento) {
      this.error = 'DPI, nombre y fecha de nacimiento son obligatorios';
      return;
    }
    this.cargando = true;
    const accion = this.editando
      ? this.clienteService.actualizar(this.form)
      : this.clienteService.crear(this.form);

    accion.subscribe({
      next: () => {
        this.mensaje = this.editando ? 'Cliente actualizado' : 'Cliente registrado';
        this.mostrarFormulario = false;
        this.cargando = false;
        this.cargar();
      },
      error: (e) => {
        this.error = e.error?.error || 'Error al guardar el cliente';
        this.cargando = false;
      }
    });
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.mostrarHistorial = false;
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