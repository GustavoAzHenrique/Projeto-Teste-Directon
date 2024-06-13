import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  UserCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  user,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  router = inject(Router);
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<any | null | undefined>(undefined);

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.firebaseAuth, email, password));
  }

  async logout(): Promise<void> {
    await this.firebaseAuth.signOut();
    this.router.navigate(['/login']);
  }

  resetPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.firebaseAuth, email));
  }

}