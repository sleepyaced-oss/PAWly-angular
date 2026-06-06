import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-mis-anuncios',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './mis-anuncios.component.html',
  styleUrls: ['./mis-anuncios.component.css']
})
export class MisAnunciosComponent implements OnInit {
  animales: any[] = [];
  cargando = true;
  error = '';
  mensaje = '';
  private readonly API = 'http://localhost/pawly-backend/api';

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    if (!this.auth.estaAutenticado()) this.router.navigate(['/login']);
  }

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    const id = this.auth.getUsuario()!.id;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.get<any[]>(`${this.API}/usuarios/${id}/animales`, { headers }).subscribe({
      next: (data) => { this.animales = data; this.cargando = false; this.cdr.detectChanges(); },
      error: () => { this.error = 'Error al cargar tus anuncios.'; this.cargando = false; this.cdr.detectChanges(); }
    });
  }

  eliminar(id: number, nombre: string): void {
    if (!confirm(`¿Seguro que quieres eliminar el anuncio de "${nombre}"?\nEsta acción no se puede deshacer.`)) return;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.delete(`${this.API}/animales/${id}`, { headers }).subscribe({
      next: () => { this.animales = this.animales.filter(a => a.id !== id); this.mensaje = `Anuncio de "${nombre}" eliminado.`; this.cdr.detectChanges(); },
      error: () => { this.error = 'Error al eliminar el anuncio.'; this.cdr.detectChanges(); }
    });
  }

  etiquetaEstado(e: string): string {
    return ({ DISPONIBLE:'Disponible', PENDIENTE_APROBACION:'Pendiente', RECHAZADO:'Rechazado', EN_PROCESO:'En proceso', ADOPTADO:'Adoptado' } as any)[e] ?? e;
  }
  iconoEspecie(e: string): string {
    return ({ Perro:'🐶', Gato:'🐱', Conejo:'🐰', Ave:'🐦', Hamster:'🐹', Tortuga:'🐢' } as any)[e] ?? '🐾';
  }
}
