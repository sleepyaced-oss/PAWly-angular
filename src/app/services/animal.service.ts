import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Animal {
  id: number;
  nombre: string;
  especie: string;
  raza?: string;
  sexo: string;
  etapa_vida: string;
  tamanyo: string;
  color: string;
  descripcion: string;
  esterilizado: number;
  vacunado: number;
  desparasitado: number;
  microchip: number;
  imagen?: string;
  provincia: string;
  localidad: string;
  estado: string;
  publicador_id: number;
  publicador_nombre: string;
  publicador_foto?: string;
  fecha_publicacion: string;
}

export interface FiltrosAnimal {
  especie?: string;
  etapa_vida?: string;
  sexo?: string;
  provincia?: string;
  color?: string;
  orden?: 'asc' | 'desc';
}

export interface Animal {
  // ... lo que ya tienes ...
  motivo_rechazo?: string;  // ← añade esta línea
}

@Injectable({ providedIn: 'root' })
export class AnimalService {

  private readonly API = 'https://pawly-backend-h4hq.onrender.com/api';
  constructor(private http: HttpClient) { }

  getAnimales(filtros: FiltrosAnimal = {}): Observable<Animal[]> {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([k, v]) => {
      if (v) params = params.set(k, v);
    });
    return this.http.get<Animal[]>(`${this.API}/animales`, { params });
  }

  getAnimal(id: number): Observable<Animal> {
    return this.http.get<Animal>(`${this.API}/animales/${id}`);
  }
}
