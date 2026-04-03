import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  nombre = '';
  password = '';
  error = '';
  cargando = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.nombre || !this.password) {
      this.error = 'Por favor ingresá usuario y contraseña';
      return;
    }
    this.cargando = true;
    this.error = '';
    this.authService.login(this.nombre, this.password).subscribe({
      next: (usuario) => {
        this.authService.guardarSesion(usuario);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Usuario o contraseña incorrectos';
        this.cargando = false;
      }
    });
  }
}