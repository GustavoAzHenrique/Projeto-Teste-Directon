import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import {
  Funcionario,
  FuncionarioService,
} from '../../services/funcionario-service/funcionario.service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'app-funcionario-lista',
  templateUrl: './funcionario-lista.component.html',
  styleUrls: ['./funcionario-lista.component.scss'],
  imports: [CommonModule, MatTableModule, MatButtonModule, MatCheckboxModule, FormsModule, MatTooltip],
})
export class FuncionarioListComponent implements OnChanges {
  displayedColumns: string[] = [
    'select',
    'imagemUrl',
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

  formatCpf(cpf: string): string {
    if (!cpf) return '';
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return cpf;
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
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
