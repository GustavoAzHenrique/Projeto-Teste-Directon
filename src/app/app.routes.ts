import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
      path: 'login',
      title: 'Pagina Login',
      loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
    { path: 'registro', title: 'Pagina Cadastro', loadComponent: () => import('./registro/registro.component').then(m => m.RegistroComponent) },
  
];
