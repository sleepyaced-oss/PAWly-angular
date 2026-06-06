import { Routes } from '@angular/router';
import { HomeComponent }           from './home/home.component';
import { LoginComponent }          from './auth/login.component';
import { AnimalComponent }         from './animal/animal.component';
import { MisAnunciosComponent }    from './mis-anuncios/mis-anuncios.component';
import { SolicitudesComponent }    from './solicitudes/solicitudes.component';
import { PublicarComponent }       from './publicar/publicar.component';
import { AdminComponent }          from './admin/admin.component';
import { PerfilComponent }         from './perfil/perfil.component';
import { EditarAnimalComponent }   from './editar-animal/editar-animal.component';
import { FavoritosComponent }      from './favoritos/favoritos.component';

export const routes: Routes = [
  { path: '',                   component: HomeComponent },
  { path: 'login',              component: LoginComponent },
  { path: 'animal/:id',         component: AnimalComponent },
  { path: 'mis-anuncios',       component: MisAnunciosComponent },
  { path: 'solicitudes',        component: SolicitudesComponent },
  { path: 'publicar',           component: PublicarComponent },
  { path: 'editar-animal/:id',  component: EditarAnimalComponent },
  { path: 'perfil',             component: PerfilComponent },
  { path: 'favoritos',          component: FavoritosComponent },
  { path: 'admin',              component: AdminComponent },
  { path: '**',                 redirectTo: '' }
];
