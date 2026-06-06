import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  recibidas: any[] = [];
  enviadas: any[]  = [];
  cargando = true;
  error = '';
  mensaje = '';
  vista: 'recibidas' | 'enviadas' = 'recibidas';
  private readonly API = 'http://localhost/pawly-backend/api';

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    if (!this.auth.estaAutenticado()) this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    let loaded = 0;
    const check = () => {
      if (++loaded === 2) {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    };
    this.http.get<any[]>(`${this.API}/solicitudes/recibidas`, { headers }).subscribe({
      next: (d) => { this.recibidas = d; check(); },
      error: () => { this.error = 'Error al cargar solicitudes.'; this.cargando = false; this.cdr.detectChanges(); }
    });
    this.http.get<any[]>(`${this.API}/solicitudes/enviadas`, { headers }).subscribe({
      next: (d) => { this.enviadas = d; check(); },
      error: () => { this.error = 'Error al cargar solicitudes.'; this.cargando = false; this.cdr.detectChanges(); }
    });
  }

  cambiarEstado(id: number, accion: 'aceptar' | 'rechazar'): void {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.put(`${this.API}/solicitudes/${id}/${accion}`, {}, { headers }).subscribe({
      next: () => {
        this.mensaje = accion === 'aceptar' ? 'Solicitud aceptada.' : 'Solicitud rechazada.';
        const s = this.recibidas.find(r => r.id === id);
        if (s) s.estado = accion === 'aceptar' ? 'ACEPTADA' : 'RECHAZADA';
        this.cdr.detectChanges();
      },
      error: (err) => { this.error = err.error?.error ?? 'Error al gestionar la solicitud.'; this.cdr.detectChanges(); }
    });
  }

  cancelar(id: number): void {
    if (!confirm('¿Cancelar esta solicitud?')) return;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.delete(`${this.API}/solicitudes/${id}`, { headers }).subscribe({
      next: () => { this.enviadas = this.enviadas.filter(s => s.id !== id); this.mensaje = 'Solicitud cancelada.'; this.cdr.detectChanges(); },
      error: (err) => { this.error = err.error?.error ?? 'Error al cancelar.'; this.cdr.detectChanges(); }
    });
  }

  etiquetaEstado(e: string): string {
    return ({ PENDIENTE:'Pendiente', ACEPTADA:'Aceptada', RECHAZADA:'Rechazada' } as any)[e] ?? e;
  }
}
