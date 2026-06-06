import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  datos = { nombre: '', telefono: '', provincia: '', localidad: '', biografia: '' };
  cargando = true;
  guardando = false;
  mensaje = '';
  error = '';
private readonly API = 'https://pawly-backend-h4hq.onrender.com/api';
  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    if (!this.auth.estaAutenticado()) this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    const usuario = this.auth.getUsuario()!;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.get<any>(`${this.API}/usuarios/${usuario.id}`, { headers }).subscribe({
      next: (u) => {
        this.datos = {
          nombre:    u.nombre    ?? '',
          telefono:  u.telefono  ?? '',
          provincia: u.provincia ?? '',
          localidad: u.localidad ?? '',
          biografia: u.biografia ?? ''
        };
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => { this.error = 'Error al cargar el perfil.'; this.cargando = false; this.cdr.detectChanges(); }
    });
  }

  guardar(): void {
    this.error = '';
    if (!this.datos.nombre) { this.error = 'El nombre es obligatorio.'; return; }
    this.guardando = true;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.put(`${this.API}/usuarios/perfil`, this.datos, { headers }).subscribe({
      next: () => {
        this.mensaje = 'Perfil actualizado correctamente.';
        this.guardando = false;
        this.cdr.detectChanges();
      },
      error: (err) => { this.error = err.error?.error ?? 'Error al guardar.'; this.guardando = false; this.cdr.detectChanges(); }
    });
  }
}
