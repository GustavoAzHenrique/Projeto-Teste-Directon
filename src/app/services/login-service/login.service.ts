import { Injectable, inject } from '@angular/core';
import {
  Auth,
  UserCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  // Injeção de dependências: Router e Auth
  router = inject(Router);
  firebaseAuth = inject(Auth);

  // Método de login com email e senha
  login(email: string, password: string): Observable<UserCredential> {
    // Retorna um Observable para assinantes, executando o login com Firebase
    return from(signInWithEmailAndPassword(this.firebaseAuth, email, password));
  }

  // Método assíncrono para logout
  async logout(): Promise<void> {
    await this.firebaseAuth.signOut(); 
    this.router.navigate(['/login']); 
  }

  // Método para enviar email de redefinição de senha
  resetPassword(email: string): Observable<void> {
    // Retorna um Observable que envia um email de redefinição de senha com Firebase
    return from(sendPasswordResetEmail(this.firebaseAuth, email));
  }
}
