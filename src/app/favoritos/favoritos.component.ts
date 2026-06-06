import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent implements OnInit {
  favoritos: any[] = [];
  cargando = true;
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
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.get<any[]>(`${this.API}/favoritos`, { headers }).subscribe({
      next: (data) => { this.favoritos = data; this.cargando = false; this.cdr.detectChanges(); },
      error: () => { this.error = 'Error al cargar favoritos.'; this.cargando = false; this.cdr.detectChanges(); }
    });
  }

  iconoEspecie(e: string): string {
    return ({ Perro: '🐶', Gato: '🐱', Conejo: '🐰', Ave: '🐦', Hamster: '🐹', Tortuga: '🐢' } as any)[e] ?? '🐾';
  }
  etiquetaEtapa(e: string): string {
    return ({ CACHORRO: 'Cachorro', ADULTO: 'Adulto', MAYOR: 'Senior' } as any)[e] ?? e;
  }
  etiquetaTamanyo(t: string): string {
    return ({ PEQUENO: 'Pequeño', MEDIANO: 'Mediano', GRANDE: 'Grande' } as any)[t] ?? t;
  }
}
