import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
      path: 'login',
      title: 'Pagina Login',
      loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
    { path: 'pagina-inicial', title: 'Pagina Inicial', loadComponent: () => import('./pagina-inicial/pagina-inicial.component').then(m => m.PaginaInicialComponent) },
  
];
