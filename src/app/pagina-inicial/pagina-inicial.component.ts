import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionarioFormComponent } from '../registro/registro.component';
import { FuncionarioListComponent } from '../funcionario/funcionario-lista/funcionario-lista.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LoginService } from '../services/login-service/login.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
})
export class PaginaInicialComponent {
  // Injeção de MatSnackBar para exibição de notificações
  private snackBar = inject(MatSnackBar);

  // Injeção de LoginService para gerenciar autenticação e logout
  private loginService = inject(LoginService);

  // Flag para controlar atualização de eventos
  atualizarEvento = false;

  // Método para atualizar o evento de acordo com o valor emitido
  refresh(evento: boolean): void {
    this.atualizarEvento = evento;
  }

  // Método para realizar logout e exibir uma mensagem de confirmação
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
    });
  }
}
