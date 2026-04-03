import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout().subscribe();
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }

  get usuario() {
    return this.authService.getUsuarioSesion();
  }

  get tipo() {
    return this.authService.getTipo();
  }

  get rolNombre() {
    switch(this.tipo) {
      case 1: return 'Atención al Cliente';
      case 2: return 'Operaciones';
      case 3: return 'Administrador';
      default: return '';
    }
  }
}