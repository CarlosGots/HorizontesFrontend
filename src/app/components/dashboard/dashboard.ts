import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  constructor(private authService: AuthService) {}

  get usuario() {
    return this.authService.getUsuarioSesion();
  }

  get tipo() {
    return this.authService.getTipo();
  }

  get rolNombre() {
    switch(this.tipo) {
      case 1: return 'Atención al Cliente';
      case 2: return 'Encargado de Operaciones';
      case 3: return 'Administrador';
      default: return '';
    }
  }
}