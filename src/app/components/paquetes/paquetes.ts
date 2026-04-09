import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaqueteService } from '../../services/paquete';
import { DestinoService } from '../../services/destino';
import { ProveedorService } from '../../services/proveedor';

@Component({
  selector: 'app-paquetes',
  imports: [CommonModule, FormsModule],
  templateUrl: './paquetes.html',
  styleUrl: './paquetes.css'
})
export class Paquetes implements OnInit {

  paquetes: any[] = [];
  destinos: any[] = [];
  proveedores: any[] = [];
  mostrarFormulario = false;
  editando = false;
  cargando = false;
  mensaje = '';
  error = '';

  form: any = {
    id: null, nombre: '', destinoId: null, duracion: 1,
    descripcion: '', precioVenta: 0, capacidad: 1, servicios: []
  };

  nuevoServicio: any = { proveedorId: null, descripcion: '', costo: 0 };

  constructor(
    private paqueteService: PaqueteService,
    private destinoService: DestinoService,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit() {
    this.cargar();
    this.destinoService.listar().subscribe(d => this.destinos = d);
    this.proveedorService.listar().subscribe(p => this.proveedores = p);
  }

  cargar() {
    this.paqueteService.listar().subscribe({
      next: (data) => this.paquetes = data,
      error: () => this.error = 'Error al cargar paquetes'
    });
  }

  nuevo() {
    this.form = {
      id: null, nombre: '', destinoId: null, duracion: 1,
      descripcion: '', precioVenta: 0, capacidad: 1, servicios: []
    };
    this.nuevoServicio = { proveedorId: null, descripcion: '', costo: 0 };
    this.editando = false;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }

  editar(p: any) {
    this.paqueteService.obtener(p.id).subscribe({
      next: (data) => {
        this.form = {
          ...data,
          servicios: data.servicios || []
        };
        this.editando = true;
        this.mostrarFormulario = true;
        this.mensaje = '';
        this.error = '';
      }
    });
  }

  agregarServicio() {
    if (!this.nuevoServicio.proveedorId || !this.nuevoServicio.descripcion || this.nuevoServicio.costo <= 0) {
      this.error = 'Completá todos los campos del servicio';
      return;
    }
    const proveedor = this.proveedores.find(p => p.id == this.nuevoServicio.proveedorId);
    this.form.servicios.push({
      ...this.nuevoServicio,
      proveedorNombre: proveedor?.nombre || ''
    });
    this.nuevoServicio = { proveedorId: null, descripcion: '', costo: 0 };
    this.error = '';
  }

  eliminarServicio(index: number) {
    this.form.servicios.splice(index, 1);
  }

  getCostoTotal(): number {
    return this.form.servicios.reduce((sum: number, s: any) => sum + Number(s.costo), 0);
  }

  getGanancia(): number {
    return this.form.precioVenta - this.getCostoTotal();
  }

  guardar() {
    if (!this.form.nombre || !this.form.destinoId || this.form.precioVenta <= 0) {
      this.error = 'Nombre, destino y precio son obligatorios';
      return;
    }
    this.cargando = true;
    const accion = this.editando
      ? this.paqueteService.actualizar(this.form)
      : this.paqueteService.crear(this.form);

    accion.subscribe({
      next: () => {
        this.mensaje = this.editando ? 'Paquete actualizado' : 'Paquete creado';
        this.mostrarFormulario = false;
        this.cargando = false;
        this.cargar();
      },
      error: () => {
        this.error = 'Error al guardar el paquete';
        this.cargando = false;
      }
    });
  }

  desactivar(id: number) {
    if (!confirm('¿Desactivar este paquete?')) return;
    this.paqueteService.desactivar(id).subscribe({
      next: () => { this.mensaje = 'Paquete desactivado'; this.cargar(); },
      error: () => this.error = 'Error al desactivar'
    });
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.error = '';
  }
  
  /** Calcula el porcentaje de ocupacion de un paquete */
getPorcentajeOcupacion(paquete: any): number {
  if (!paquete.capacidad) return 0;
  return Math.round((paquete.ocupacion || 0) / paquete.capacidad * 100);
}

/** Verifica si el paquete tiene alta demanda (mas del 80%) */
esAltaDemanda(paquete: any): boolean {
  return this.getPorcentajeOcupacion(paquete) >= 80;
}
}