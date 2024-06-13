import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionarioFormComponent } from '../registro/registro.component';
import { FuncionarioListComponent } from '../funcionario/funcionario-lista/funcionario-lista.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  standalone: true,
  selector: 'app-main',
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.scss'],
  imports: [CommonModule, FuncionarioFormComponent, FuncionarioListComponent],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }]
})
export class PaginaInicialComponent {

  atualizarEvento = false;

  refresh(evento: boolean) {
    this.atualizarEvento = evento;
  }

}
