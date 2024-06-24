import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    title: 'Pagina Login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'pagina-inicial',
    title: 'Pagina Inicial',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pagina-inicial/pagina-inicial.component').then(
        (m) => m.PaginaInicialComponent
      ),
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];