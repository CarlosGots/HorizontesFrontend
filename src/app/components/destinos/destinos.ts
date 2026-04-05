import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DestinoService } from '../../services/destino';

@Component({
  selector: 'app-destinos',
  imports: [CommonModule, FormsModule],
  templateUrl: './destinos.html',
  styleUrl: './destinos.css'
})
export class Destinos implements OnInit {

  destinos: any[] = [];
  mostrarFormulario = false;
  editando = false;
  cargando = false;
  mensaje = '';
  error = '';

  form: any = {
    id: null,
    nombre: '',
    pais: '',
    descripcion: '',
    clima: '',
    imagenUrl: ''
  };

  constructor(private destinoService: DestinoService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.destinoService.listar().subscribe({
      next: (data) => this.destinos = data,
      error: () => this.error = 'Error al cargar destinos'
    });
  }

  nuevo() {
    this.form = { id: null, nombre: '', pais: '', descripcion: '', clima: '', imagenUrl: '' };
    this.editando = false;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }

  editar(d: any) {
    this.form = { ...d };
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
      ? this.destinoService.actualizar(this.form)
      : this.destinoService.crear(this.form);

    accion.subscribe({
      next: () => {
        this.mensaje = this.editando ? 'Destino actualizado' : 'Destino creado';
        this.mostrarFormulario = false;
        this.cargando = false;
        this.cargar();
      },
      error: () => {
        this.error = 'Error al guardar el destino';
        this.cargando = false;
      }
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Estás seguro de eliminar este destino?')) return;
    this.destinoService.eliminar(id).subscribe({
      next: () => {
        this.mensaje = 'Destino eliminado';
        this.cargar();
      },
      error: () => this.error = 'Error al eliminar el destino'
    });
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.error = '';
  }
} 