import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  token: string;
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  provincia?: string;
  localidad?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API = 'http://localhost/pawly-backend/api';
  private readonly TOKEN_KEY = 'pawly_token';
  private readonly USER_KEY  = 'pawly_user';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/auth/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify({
          id: res.id, nombre: res.nombre, email: res.email, rol: res.rol
        }));
      })
    );
  }

  register(datos: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/auth/register`, datos).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify({
          id: res.id, nombre: res.nombre, email: res.email, rol: res.rol
        }));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsuario(): { id: number; nombre: string; email: string; rol: string } | null {
    const u = localStorage.getItem(this.USER_KEY);
    return u ? JSON.parse(u) : null;
  }

  estaAutenticado(): boolean {
    return !!this.getToken();
  }

  esAdmin(): boolean {
    return this.getUsuario()?.rol === 'ADMIN';
  }
}
