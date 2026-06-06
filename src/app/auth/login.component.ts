import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

type Modo = 'login' | 'register';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  modo: Modo = 'login';
  loginData = { email: '', password: '' };
  registerData = { nombre: '', email: '', password: '', confirmar: '', telefono: '', provincia: '', localidad: '' };
  cargando = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.estaAutenticado()) this.router.navigate(['/']);
  }

  cambiarModo(m: Modo): void { this.modo = m; this.error = ''; }

  onLogin(): void {
    this.error = '';
    if (!this.loginData.email || !this.loginData.password) { this.error = 'Rellena todos los campos.'; return; }
    this.cargando = true;
    this.auth.login(this.loginData.email, this.loginData.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => { this.error = err.error?.error ?? 'Error al iniciar sesión.'; this.cargando = false; }
    });
  }

  onRegister(): void {
    this.error = '';
    if (!this.registerData.nombre || !this.registerData.email || !this.registerData.password) {
      this.error = 'Nombre, email y contraseña son obligatorios.'; return;
    }
    if (this.registerData.password !== this.registerData.confirmar) {
      this.error = 'Las contraseñas no coinciden.'; return;
    }
    if (this.registerData.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres.'; return;
    }
    this.cargando = true;
    const { confirmar, ...datos } = this.registerData;
    this.auth.register(datos).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => { this.error = err.error?.error ?? 'Error al crear la cuenta.'; this.cargando = false; }
    });
  }
}
