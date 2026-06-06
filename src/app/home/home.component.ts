import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimalService, Animal, FiltrosAnimal } from '../services/animal.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  animales: Animal[] = [];
  cargando = true;
  error = '';

  filtros: FiltrosAnimal = { especie: '', etapa_vida: '', sexo: '', orden: 'desc' };

  especies = ['Perro', 'Gato', 'Conejo', 'Ave', 'Hamster', 'Tortuga'];
  etapas   = ['CACHORRO', 'ADULTO', 'MAYOR'];
  sexos    = ['MACHO', 'HEMBRA'];

  constructor(private animalService: AnimalService, private router: Router) {}

  ngOnInit(): void { this.cargarAnimales(); }

  cargarAnimales(): void {
    this.cargando = true;
    this.error = '';
    this.animalService.getAnimales(this.filtros).subscribe({
      next: (data) => { this.animales = data; this.cargando = false; },
      error: () => { this.error = 'No se pudieron cargar los animales.'; this.cargando = false; }
    });
  }

  aplicarFiltros(): void { this.cargarAnimales(); }

  limpiarFiltros(): void {
    this.filtros = { especie: '', etapa_vida: '', sexo: '', orden: 'desc' };
    this.cargarAnimales();
  }

  verDetalle(id: number): void { this.router.navigate(['/animal', id]); }

  etiquetaEtapa(e: string): string {
    return ({ CACHORRO: 'Cachorro', ADULTO: 'Adulto', MAYOR: 'Senior' } as any)[e] ?? e;
  }
  etiquetaTamanyo(t: string): string {
    return ({ PEQUENO: 'Pequeño', MEDIANO: 'Mediano', GRANDE: 'Grande' } as any)[t] ?? t;
  }
}
