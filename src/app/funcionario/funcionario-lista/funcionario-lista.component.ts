import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import {
  Funcionario,
  FuncionarioService,
} from '../../services/funcionario-service/funcionario.service';

@Component({
  standalone: true,
  selector: 'app-funcionario-lista',
  templateUrl: './funcionario-lista.component.html',
  styleUrls: ['./funcionario-lista.component.scss'],
  imports: [CommonModule, MatTableModule, MatButtonModule, MatCheckboxModule, FormsModule],
})
export class FuncionarioListComponent implements OnChanges {
  displayedColumns: string[] = [
    'select',
    'nome',
    'email',
    'dataContratacao',
    'cpf',
    'endereco',
  ];
  dataSource: Funcionario[] = [];

  @Input()
  atualizarEvento: boolean = false;
  toggleAtivo: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['atualizarEvento'] && changes['atualizarEvento'].currentValue) {
      this.carregarFuncionarios();
    }
  }

  carregarFuncionarios() {
    this.funcionarioService.loadFuncionariosFromStorage();
    this.dataSource = this.funcionarioService.listarTodosFuncionarios();
  }

  constructor(private funcionarioService: FuncionarioService) {
    this.carregarFuncionarios();
  }

  removeFuncionario(funcionario: Funcionario) {
    this.funcionarioService.removerFuncionario(funcionario.id);
    this.dataSource = this.funcionarioService.listarTodosFuncionarios();
  }

  toggleFuncionarioStatus(funcionario: Funcionario) {
    this.funcionarioService.toggleAtivo(funcionario.id);
    this.dataSource = this.funcionarioService.listarTodosFuncionarios();
  }
}
