import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionarioFormComponent } from '../registro/registro.component';
import { FuncionarioListComponent } from '../funcionario/funcionario-lista/funcionario-lista.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LoginService } from '../services/login-service/login.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-main',
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.scss'],
  imports: [
    CommonModule,
    FuncionarioFormComponent,
    FuncionarioListComponent,
    MatButtonModule,
    MatCard,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
})
export class PaginaInicialComponent {
  constructor(private snackBar: MatSnackBar) {}
  loginService = inject(LoginService);

  atualizarEvento = false;

  refresh(evento: boolean) {
    this.atualizarEvento = evento;
  }

  logout(): void {
    this.loginService.logout().then(() => {
      this.snackBar.open(
        'Logout realizado com sucesso. Volte sempre!',
        'Fechar',
        {
          duration: 5000,
          panelClass: ['snackbar-info'],
        }
      );
    })
  }
}
