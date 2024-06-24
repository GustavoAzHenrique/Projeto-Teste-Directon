import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { LoginService } from '../services/login-service/login.service';

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
  // Gerencia o formulário de login
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private loginService: LoginService, 
    private router: Router, 
    private snackBar: MatSnackBar
  ) {
    this.initializeForm();
  }

  // Configura os campos do formulário com validações
  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // Processa o envio do formulário de login
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.loginService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/pagina-inicial']);
          this.showSnackBar('Login realizado com sucesso. Bem-vindo!', 'snackbar-success');
        },
        error: (err) => {
          console.error(err);
          this.showSnackBar('Este e-mail não tem as permissões necessárias para acesso.', 'snackbar-error');
        },
      });
    }
  }

  // Processa a recuperação de senha
  onForgotPassword(): void {
    const email = this.loginForm.controls['email'].value;

    if (!email) {
      this.showSnackBar('Insira um email válido para recuperar sua senha.', 'snackbar-warning');
    } else {
      this.loginService.resetPassword(email);
      this.showSnackBar('Instruções para redefinir sua senha foram enviadas para o seu e-mail.', 'snackbar-info');
    }
  }

  // Exibe mensagens usando MatSnackBar
  private showSnackBar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: [panelClass],
    });
  }
}
