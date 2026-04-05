import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {

  usuarios: any[] = [];
  mostrarFormulario = false;
  editando = false;
  cargando = false;
  mensaje = '';
  error = '';

  roles = [
    { id: 1, nombre: 'Atención al Cliente' },
    { id: 2, nombre: 'Operaciones' },
    { id: 3, nombre: 'Administrador' }
  ];

  form: any = {
    id: null, nombre: '', password: '', tipo: 1, activo: true
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.usuarioService.listar().subscribe({
      next: (data) => this.usuarios = data,
      error: () => this.error = 'Error al cargar usuarios'
    });
  }

  nuevo() {
    this.form = { id: null, nombre: '', password: '', tipo: 1, activo: true };
    this.editando = false;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }

  editar(u: any) {
    this.form = { ...u, password: '' };
    this.editando = true;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }

  guardar() {
    if (!this.form.nombre) {
      this.error = 'El nombre de usuario es obligatorio';
      return;
    }
    if (!this.editando && this.form.password.length < 6) {
      this.error = 'La contraseña debe tener mínimo 6 caracteres';
      return;
    }
    this.cargando = true;
    const accion = this.editando
      ? this.usuarioService.actualizar(this.form)
      : this.usuarioService.crear(this.form);

    accion.subscribe({
      next: () => {
        this.mensaje = this.editando ? 'Usuario actualizado' : 'Usuario creado';
        this.mostrarFormulario = false;
        this.cargando = false;
        this.cargar();
      },
      error: (e) => {
        this.error = e.error?.error || 'Error al guardar el usuario';
        this.cargando = false;
      }
    });
  }

  desactivar(id: number) {
    if (!confirm('¿Desactivar este usuario?')) return;
    this.usuarioService.desactivar(id).subscribe({
      next: () => { this.mensaje = 'Usuario desactivado'; this.cargar(); },
      error: () => this.error = 'Error al desactivar el usuario'
    });
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.error = '';
  }

  getRolNombre(tipo: number): string {
    return this.roles.find(r => r.id === tipo)?.nombre || '—';
  }
}