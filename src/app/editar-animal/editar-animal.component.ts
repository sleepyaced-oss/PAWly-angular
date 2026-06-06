import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-editar-animal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './editar-animal.component.html',
  styleUrls: ['./editar-animal.component.css']
})
export class EditarAnimalComponent implements OnInit {
  datos: any = null;
  cargando = true;
  guardando = false;
  error = '';
  especies  = ['Perro', 'Gato', 'Conejo', 'Ave', 'Hamster', 'Tortuga'];
  sexos     = ['MACHO', 'HEMBRA'];
  etapas    = ['CACHORRO', 'ADULTO', 'MAYOR'];
  tamanios  = ['PEQUENO', 'MEDIANO', 'GRANDE'];
  private readonly API = 'http://localhost/pawly-backend/api';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    if (!this.auth.estaAutenticado()) this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.get<any>(`${this.API}/animales/${id}`, { headers }).subscribe({
      next: (a) => {
        // Verificar que es el publicador
        if (a.publicador_id !== this.auth.getUsuario()!.id && !this.auth.esAdmin()) {
          this.router.navigate(['/mis-anuncios']); return;
        }
        this.datos = { ...a };
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => { this.error = 'Animal no encontrado.'; this.cargando = false; this.cdr.detectChanges(); }
    });
  }

  guardar(): void {
    this.error = '';
    const req = ['nombre','especie','sexo','etapa_vida','tamanyo','color','descripcion','provincia','localidad'];
    for (const c of req) {
      if (!this.datos[c]) { this.error = `El campo "${c.replace('_',' ')}" es obligatorio.`; return; }
    }
    this.guardando = true;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.put(`${this.API}/animales/${this.datos.id}`, this.datos, { headers }).subscribe({
      next: () => this.router.navigate(['/mis-anuncios']),
      error: (err) => { this.error = err.error?.error ?? 'Error al guardar.'; this.guardando = false; this.cdr.detectChanges(); }
    });
  }

  etiquetaTamanyo(t: string): string {
    return ({ PEQUENO:'Pequeño', MEDIANO:'Mediano', GRANDE:'Grande' } as any)[t] ?? t;
  }
  etiquetaEtapa(e: string): string {
    return ({ CACHORRO:'Cachorro', ADULTO:'Adulto', MAYOR:'Senior' } as any)[e] ?? e;
  }
}
