import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  usuarios: any[]    = [];
  animales: any[]    = [];
  solicitudes: any[] = [];
  vista: 'usuarios' | 'animales' | 'solicitudes' = 'animales';
  cargando = true;
  mensaje  = '';
  error    = '';

  // Nuevo usuario
  mostrarFormUsuario = false;
  nuevoUsuario = { nombre: '', email: '', password: '', telefono: '', provincia: '', localidad: '', rol: 'USER' };
  guardandoUsuario = false;
  errorUsuario = '';

  // Editar usuario
  usuarioEditando: any = null;
  guardandoEdicionUsuario = false;
  errorEdicionUsuario = '';

  // Editar animal
  animalEditando: any = null;
  guardandoEdicionAnimal = false;
  errorEdicionAnimal = '';
  especies  = ['Perro', 'Gato', 'Conejo', 'Ave', 'Hamster', 'Tortuga'];
  sexos     = ['MACHO', 'HEMBRA'];
  etapas    = ['CACHORRO', 'ADULTO', 'MAYOR'];
  tamanios  = ['PEQUENO', 'MEDIANO', 'GRANDE'];

  private readonly API = 'http://localhost/pawly-backend/api';

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    if (!this.auth.esAdmin()) this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.recargar();
  }

  recargar(): void {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    let loaded = 0;
    const check = () => { if (++loaded === 3) { this.cargando = false; this.cdr.detectChanges(); } };
    this.http.get<any[]>(`${this.API}/admin/usuarios`, { headers }).subscribe({ next: d => { this.usuarios = d; check(); }, error: () => check() });
    this.http.get<any[]>(`${this.API}/admin/animales`, { headers }).subscribe({ next: d => { this.animales = d; check(); }, error: () => check() });
    this.http.get<any[]>(`${this.API}/admin/solicitudes`, { headers }).subscribe({ next: d => { this.solicitudes = d; check(); }, error: () => check() });
  }

  // ── Nuevo usuario ──────────────────────────────────────────────────────────
  abrirFormUsuario(): void {
    this.mostrarFormUsuario = true;
    this.usuarioEditando = null;
    this.nuevoUsuario = { nombre: '', email: '', password: '', telefono: '', provincia: '', localidad: '', rol: 'USER' };
    this.errorUsuario = '';
  }

  cerrarFormUsuario(): void {
    this.mostrarFormUsuario = false;
    this.errorUsuario = '';
  }

  crearUsuario(): void {
    this.errorUsuario = '';
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.email || !this.nuevoUsuario.password) {
      this.errorUsuario = 'Nombre, email y contraseña son obligatorios.'; return;
    }
    if (this.nuevoUsuario.password.length < 6) {
      this.errorUsuario = 'La contraseña debe tener al menos 6 caracteres.'; return;
    }
    this.guardandoUsuario = true;
    this.http.post<any>(`${this.API}/auth/register`, this.nuevoUsuario).subscribe({
      next: (res) => {
        this.usuarios.unshift({ id: res.id, nombre: this.nuevoUsuario.nombre, email: this.nuevoUsuario.email, provincia: this.nuevoUsuario.provincia, localidad: this.nuevoUsuario.localidad, rol: this.nuevoUsuario.rol, activo: 1 });
        this.mensaje = `Usuario "${this.nuevoUsuario.nombre}" creado correctamente.`;
        this.mostrarFormUsuario = false;
        this.guardandoUsuario = false;
        this.cdr.detectChanges();
      },
      error: (err) => { this.errorUsuario = err.error?.error ?? 'Error al crear el usuario.'; this.guardandoUsuario = false; this.cdr.detectChanges(); }
    });
  }

  // ── Editar usuario ─────────────────────────────────────────────────────────
  abrirEdicionUsuario(u: any): void {
    this.usuarioEditando = { ...u };
    this.mostrarFormUsuario = false;
    this.errorEdicionUsuario = '';
  }

  cerrarEdicionUsuario(): void {
    this.usuarioEditando = null;
    this.errorEdicionUsuario = '';
  }

  guardarEdicionUsuario(): void {
    this.errorEdicionUsuario = '';
    if (!this.usuarioEditando.nombre) { this.errorEdicionUsuario = 'El nombre es obligatorio.'; return; }
    this.guardandoEdicionUsuario = true;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.put(`${this.API}/admin/usuarios/${this.usuarioEditando.id}`, this.usuarioEditando, { headers }).subscribe({
      next: () => {
        const idx = this.usuarios.findIndex(u => u.id === this.usuarioEditando.id);
        if (idx !== -1) this.usuarios[idx] = { ...this.usuarioEditando };
        this.mensaje = `Usuario "${this.usuarioEditando.nombre}" actualizado.`;
        this.usuarioEditando = null;
        this.guardandoEdicionUsuario = false;
        this.cdr.detectChanges();
      },
      error: (err) => { this.errorEdicionUsuario = err.error?.error ?? 'Error al actualizar.'; this.guardandoEdicionUsuario = false; this.cdr.detectChanges(); }
    });
  }

  eliminarUsuario(id: number, nombre: string): void {
    if (!confirm(`¿Seguro que quieres eliminar al usuario "${nombre}"?\n\nEsta acción eliminará también todos sus anuncios y no se puede deshacer.`)) return;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.delete(`${this.API}/admin/usuarios/${id}`, { headers }).subscribe({
      next: () => { this.usuarios = this.usuarios.filter(u => u.id !== id); this.mensaje = `Usuario "${nombre}" eliminado.`; this.cdr.detectChanges(); },
      error: (err) => { this.error = err.error?.error ?? 'Error al eliminar.'; this.cdr.detectChanges(); }
    });
  }

  // ── Editar animal ──────────────────────────────────────────────────────────
  abrirEdicionAnimal(a: any): void {
    this.animalEditando = { ...a };
    this.errorEdicionAnimal = '';
  }

  cerrarEdicionAnimal(): void {
    this.animalEditando = null;
    this.errorEdicionAnimal = '';
  }

  guardarEdicionAnimal(): void {
    this.errorEdicionAnimal = '';
    const req = ['nombre','especie','sexo','etapa_vida','tamanyo','color','descripcion','provincia','localidad'];
    for (const c of req) {
      if (!this.animalEditando[c]) { this.errorEdicionAnimal = `El campo "${c.replace('_',' ')}" es obligatorio.`; return; }
    }
    this.guardandoEdicionAnimal = true;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.put(`${this.API}/animales/${this.animalEditando.id}`, this.animalEditando, { headers }).subscribe({
      next: () => {
        const idx = this.animales.findIndex(a => a.id === this.animalEditando.id);
        if (idx !== -1) this.animales[idx] = { ...this.animalEditando, estado: 'PENDIENTE_APROBACION' };
        this.mensaje = `Animal "${this.animalEditando.nombre}" actualizado. Pendiente de aprobación.`;
        this.animalEditando = null;
        this.guardandoEdicionAnimal = false;
        this.cdr.detectChanges();
      },
      error: (err) => { this.errorEdicionAnimal = err.error?.error ?? 'Error al actualizar.'; this.guardandoEdicionAnimal = false; this.cdr.detectChanges(); }
    });
  }

  eliminarAnimal(id: number, nombre: string): void {
    if (!confirm(`¿Seguro que quieres eliminar el anuncio de "${nombre}"?\nEsta acción no se puede deshacer.`)) return;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.delete(`${this.API}/animales/${id}`, { headers }).subscribe({
      next: () => { this.animales = this.animales.filter(a => a.id !== id); this.mensaje = `Animal "${nombre}" eliminado.`; this.cdr.detectChanges(); },
      error: (err) => { this.error = err.error?.error ?? 'Error al eliminar.'; this.cdr.detectChanges(); }
    });
  }

  // ── Admin: aprobar/rechazar ────────────────────────────────────────────────
  aprobar(id: number): void {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.put(`${this.API}/admin/animales/${id}/aprobar`, {}, { headers }).subscribe({
      next: () => { const a = this.animales.find(x => x.id === id); if (a) a.estado = 'DISPONIBLE'; this.mensaje = 'Anuncio aprobado.'; this.cdr.detectChanges(); },
      error: (err) => { this.error = err.error?.error ?? 'Error.'; }
    });
  }

  rechazar(id: number): void {
    const motivo = prompt('Motivo del rechazo:');
    if (!motivo) return;
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
    this.http.put(`${this.API}/admin/animales/${id}/rechazar`, { motivo }, { headers }).subscribe({
      next: () => { const a = this.animales.find(x => x.id === id); if (a) a.estado = 'RECHAZADO'; this.mensaje = 'Anuncio rechazado.'; this.cdr.detectChanges(); },
      error: (err) => { this.error = err.error?.error ?? 'Error.'; }
    });
  }

  etiquetaEstado(e: string): string {
    return ({ DISPONIBLE:'Disponible', PENDIENTE_APROBACION:'Pendiente', RECHAZADO:'Rechazado', EN_PROCESO:'En proceso', ADOPTADO:'Adoptado' } as any)[e] ?? e;
  }
  etiquetaSolicitud(e: string): string {
    return ({ PENDIENTE:'Pendiente', ACEPTADA:'Aceptada', RECHAZADA:'Rechazada' } as any)[e] ?? e;
  }
  etiquetaTamanyo(t: string): string {
    return ({ PEQUENO:'Pequeño', MEDIANO:'Mediano', GRANDE:'Grande' } as any)[t] ?? t;
  }

  get animalesPendientes(): number { return this.animales.filter(a => a.estado === 'PENDIENTE_APROBACION').length; }
}
