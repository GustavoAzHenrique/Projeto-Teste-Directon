import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../services/login-service/login.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.loginService.login(email, password).subscribe({
        next: (e) => {
          this.router.navigate(['/pagina-inicial']);
          this.snackBar.open('Login realizado com sucesso. Bem-vindo!', 'Fechar', {
            duration: 5000,
            panelClass: ['snackbar-success'],
          });
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open(
            'Este e-mail não tem as permissões necessárias para acesso.',
            'Fechar',
            {
              duration: 5000,
              panelClass: ['snackbar-error'],
            }
          );
        },
      });
    }
  }

  onForgotPassword() {
    const email = this.loginForm.controls['email'].value;

    if (!email) {
      this.snackBar.open(
        'Insira um email válido para recuperar sua senha.',
        'Fechar',
        {
          duration: 5000,
          panelClass: ['snackbar-warning'],
        }
      );
    } else {
      this.loginService.resetPassword(email);
      this.snackBar.open(
        'Instruções para redefinir sua senha foram enviadas para o seu e-mail.',
        'Fechar',
        {
          duration: 5000,
          panelClass: ['snackbar-info'],
        }
      );
    }
  }
}
