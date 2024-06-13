import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginService } from './services/login-service/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  loginService = inject(LoginService);

  ngOnInit(): void {
    this.loginService.user$.subscribe((user: any) => {
      if (user) {
        console.log(user);
        this.loginService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!,
        });
      } else {
        this.loginService.currentUserSig.set(null);
      }
      console.log(this.loginService.currentUserSig());
    });
  }


}