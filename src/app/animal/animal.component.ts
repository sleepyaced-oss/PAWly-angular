import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnimalService, Animal } from '../services/animal.service';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-animal',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.css']
})
export class AnimalComponent implements OnInit {
  animal: Animal | null = null;
  cargando = true;
  error = '';
  mensajeSolicitud = '';
  enviando = false;
  exito = '';
  esFavorito = false;
  toggleandoFav = false;
  private readonly API = 'https://pawly-backend-h4hq.onrender.com/api';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animalService: AnimalService,
    public auth: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.animalService.getAnimal(id).subscribe({
      next: (a) => {
        this.animal = a;
        this.cargando = false;
        if (this.auth.estaAutenticado() && !this.esPropio()) {
          this.comprobarFavorito(a.id);
        }
        this.cdr.detectChanges();
      },
      error: () => { this.error = 'Animal no encontrado.'; this.cargando = false; this.cdr.detectChanges(); }
    });
  }

  comprobarFavorito(animalId: number): void {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.get<any[]>(`${this.API}/favoritos`, { headers }).subscribe({
      next: (favs) => {
        this.esFavorito = favs.some(f => f.id === animalId);
        this.cdr.detectChanges();
      },
      error: () => { }
    });
  }

  toggleFavorito(): void {
    if (!this.animal) return;
    this.toggleandoFav = true;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.post<any>(`${this.API}/favoritos/${this.animal.id}`, {}, { headers }).subscribe({
      next: (res) => {
        this.esFavorito = res.favorito;
        this.toggleandoFav = false;
        this.cdr.detectChanges();
      },
      error: () => { this.toggleandoFav = false; this.cdr.detectChanges(); }
    });
  }

  esPropio(): boolean {
    return this.animal?.publicador_id === this.auth.getUsuario()?.id;
  }

  enviarSolicitud(): void {
    if (!this.animal) return;
    this.enviando = true;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.post(`${this.API}/solicitudes/${this.animal.id}`, { mensaje: this.mensajeSolicitud }, { headers }).subscribe({
      next: () => { this.exito = '¡Solicitud enviada correctamente!'; this.enviando = false; this.cdr.detectChanges(); },
      error: (err) => { this.error = err.error?.error ?? 'Error al enviar la solicitud.'; this.enviando = false; this.cdr.detectChanges(); }
    });
  }

  etiquetaEtapa(e: string): string {
    return ({ CACHORRO: 'Cachorro', ADULTO: 'Adulto', MAYOR: 'Senior' } as any)[e] ?? e;
  }
  etiquetaTamanyo(t: string): string {
    return ({ PEQUENO: 'Pequeño', MEDIANO: 'Mediano', GRANDE: 'Grande' } as any)[t] ?? t;
  }
  iconoEspecie(e: string): string {
    return ({ Perro: '🐶', Gato: '🐱', Conejo: '🐰', Ave: '🐦', Hamster: '🐹', Tortuga: '🐢' } as any)[e] ?? '🐾';
  }
}
