import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-publicar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './publicar.component.html',
  styleUrls: ['./publicar.component.css']
})
export class PublicarComponent {
  datos = {
    nombre: '', especie: '', raza: '', sexo: '', etapa_vida: '',
    tamanyo: '', color: '', descripcion: '',
    esterilizado: 0, vacunado: 0, desparasitado: 0, microchip: 0,
    provincia: '', localidad: ''
  };

  especies = ['Perro', 'Gato', 'Conejo', 'Ave', 'Hamster', 'Tortuga'];
  sexos = ['MACHO', 'HEMBRA'];
  etapas = ['CACHORRO', 'ADULTO', 'MAYOR'];
  tamanios = ['PEQUENO', 'MEDIANO', 'GRANDE'];

  cargando = false;
  error = '';
  private readonly API = 'https://pawly-backend-h4hq.onrender.com/api';
  constructor(private auth: AuthService, private router: Router, private http: HttpClient) {
    if (!this.auth.estaAutenticado()) this.router.navigate(['/login']);
  }

  onSubmit(): void {
    this.error = '';
    const requeridos = ['nombre', 'especie', 'sexo', 'etapa_vida', 'tamanyo', 'color', 'descripcion', 'provincia', 'localidad'];
    for (const campo of requeridos) {
      if (!(this.datos as any)[campo]) {
        this.error = `El campo "${campo.replace('_', ' ')}" es obligatorio.`;
        return;
      }
    }
    this.cargando = true;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.post<any>(`${this.API}/animales`, this.datos, { headers }).subscribe({
      next: (res) => this.router.navigate(['/mis-anuncios']),
      error: (err) => { this.error = err.error?.error ?? 'Error al publicar.'; this.cargando = false; }
    });
  }

  etiquetaTamanyo(t: string): string {
    return ({ PEQUENO: 'Pequeño', MEDIANO: 'Mediano', GRANDE: 'Grande' } as any)[t] ?? t;
  }
  etiquetaEtapa(e: string): string {
    return ({ CACHORRO: 'Cachorro', ADULTO: 'Adulto', MAYOR: 'Senior' } as any)[e] ?? e;
  }
}
