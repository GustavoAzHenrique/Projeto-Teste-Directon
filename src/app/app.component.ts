import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginService } from './services/login-service/login.service';
import { Auth, user } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  loginService = inject(LoginService);
  
  user$ = user(inject(Auth));
  currentUserSig = signal<any | null | undefined>(undefined);

  ngOnInit(): void {
    this.user$.subscribe((user: any) => {
      if (user) {
        this.currentUserSig.set({
          email: user.email!,
          username: user.displayName!,
        });
      } else {
        this.currentUserSig.set(null);
      }
    });
  }

}