import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  template: `
    <nav class="navbar">
      <a routerLink="/" class="navbar__brand">
        <span class="navbar__name">PAWly</span>
      </a>
      <div class="navbar__links">
        <a routerLink="/" class="navbar__btn">Adoptar</a>
        <ng-container *ngIf="!auth.estaAutenticado()">
          <a routerLink="/login" class="navbar__btn navbar__btn--accent">Entrar</a>
        </ng-container>
        <ng-container *ngIf="auth.estaAutenticado()">
          <a routerLink="/mis-anuncios" class="navbar__btn navbar__btn--hide">Mis anuncios</a>
          <a routerLink="/solicitudes"  class="navbar__btn navbar__btn--hide">Solicitudes</a>
          <a routerLink="/favoritos"    class="navbar__btn navbar__btn--fav">❤️</a>
          <a *ngIf="auth.esAdmin()" routerLink="/admin" class="navbar__btn navbar__btn--admin">Admin</a>
          <a routerLink="/perfil"       class="navbar__btn navbar__btn--user">{{ auth.getUsuario()?.nombre }}</a>
          <button class="navbar__btn navbar__btn--logout" (click)="logout()">Salir</button>
        </ng-container>
      </div>
    </nav>
    <router-outlet />
  `,
  styles: [`
    .navbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 24px; height: 56px; background: #386641;
      position: sticky; top: 0; z-index: 100;
      box-shadow: 0 2px 16px rgba(0,0,0,.18);
    }
    .navbar__brand { display: flex; align-items: center; text-decoration: none; flex-shrink: 0; }
    .navbar__name { font-family: 'Georgia', serif; font-size: 1.3rem; color: #f2e8cf; letter-spacing: -.01em; }
    .navbar__links { display: flex; align-items: center; gap: 6px; flex-wrap: nowrap; overflow: hidden; }

    .navbar__btn {
      background: none;
      border: 1px solid rgba(242,232,207,.3);
      color: rgba(242,232,207,.8);
      border-radius: 6px;
      padding: 5px 12px;
      font-size: .8rem;
      font-family: 'Courier New', monospace;
      letter-spacing: .05em;
      text-decoration: none;
      cursor: pointer;
      transition: all .2s;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .navbar__btn:hover {
      border-color: rgba(242,232,207,.7);
      color: #f2e8cf;
      background: rgba(242,232,207,.08);
    }
    .navbar__btn--admin { border-color: rgba(167,201,87,.4); color: #a7c957; }
    .navbar__btn--admin:hover { border-color: #a7c957; color: #f2e8cf; background: rgba(167,201,87,.12); }
    .navbar__btn--user { border-color: rgba(167,201,87,.3); color: #a7c957; max-width: 120px; overflow: hidden; text-overflow: ellipsis; }
    .navbar__btn--user:hover { border-color: rgba(167,201,87,.7); color: #f2e8cf; background: rgba(167,201,87,.1); }
    .navbar__btn--logout:hover { border-color: #c24667; color: #c24667; background: rgba(194,70,103,.1); }
    .navbar__btn--fav { padding: 5px 9px; font-size: .95rem; border-color: rgba(242,232,207,.2); }
    .navbar__btn--fav:hover { border-color: #c24667; transform: scale(1.1); background: rgba(194,70,103,.08); }
    .navbar__btn--accent { background: #f2e8cf; color: #386641; border-color: #f2e8cf; font-weight: 700; }
    .navbar__btn--accent:hover { background: #a7c957; border-color: #a7c957; color: #1a2e1c; }

    /* En móvil ocultamos Mis anuncios y Solicitudes — accesibles desde el menú */
    @media (max-width: 600px) {
      .navbar { padding: 0 14px; height: 52px; }
      .navbar__btn--hide { display: none; }
      .navbar__btn { font-size: .75rem; padding: 5px 9px; }
      .navbar__btn--user { max-width: 80px; }
    }
  `]
})
export class AppComponent {
  constructor(public auth: AuthService, private router: Router) {}
  logout(): void { this.auth.logout(); this.router.navigate(['/']); }
}
