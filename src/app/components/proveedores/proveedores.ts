import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedorService } from '../../services/proveedor';

@Component({
  selector: 'app-proveedores',
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css'
})
export class Proveedores implements OnInit {

  proveedores: any[] = [];
  mostrarFormulario = false;
  editando = false;
  cargando = false;
  mensaje = '';
  error = '';

  tiposServicio: any[] = [
    { id: 1, nombre: 'Aerolínea' },
    { id: 2, nombre: 'Hotel' },
    { id: 3, nombre: 'Tour' },
    { id: 4, nombre: 'Traslado' },
    { id: 5, nombre: 'Otro' }
  ];

  form: any = {
    id: null, nombre: '', tipo: 1, pais: '', contacto: ''
  };

  constructor(private proveedorService: ProveedorService) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.proveedorService.listar().subscribe({
      next: (data) => this.proveedores = data,
      error: () => this.error = 'Error al cargar proveedores'
    });
  }

  nuevo() {
    this.form = { id: null, nombre: '', tipo: 1, pais: '', contacto: '' };
    this.editando = false;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }

  editar(p: any) {
    this.form = { ...p };
    this.editando = true;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }

  guardar() {
    if (!this.form.nombre || !this.form.pais) {
      this.error = 'Nombre y país son obligatorios';
      return;
    }
    this.cargando = true;
    const accion = this.editando
      ? this.proveedorService.actualizar(this.form)
      : this.proveedorService.crear(this.form);

    accion.subscribe({
      next: () => {
        this.mensaje = this.editando ? 'Proveedor actualizado' : 'Proveedor creado';
        this.mostrarFormulario = false;
        this.cargando = false;
        this.cargar();
      },
      error: () => {
        this.error = 'Error al guardar el proveedor';
        this.cargando = false;
      }
    });
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.error = '';
  }

  getTipoNombre(tipo: number): string {
    return this.tiposServicio.find(t => t.id === tipo)?.nombre || '—';
  }
}