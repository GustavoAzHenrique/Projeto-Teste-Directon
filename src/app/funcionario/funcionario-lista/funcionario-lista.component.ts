import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import {
  Funcionario,
  FuncionarioService,
} from '../../services/funcionario-service/funcionario.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginatorIntlPt } from '../../services/paginator/mat-paginator-intl-pt';
import { Subscription } from 'rxjs';

// Mock de funcionários para simulação
export const MOCK_FUNCIONARIOS: Funcionario[] = [
  {
    id: 1,
    ativo: true,
    imagemUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
    nome: 'Carlos Silva',
    email: 'carlos.silva@example.com',
    dataContratacao: new Date('2020-01-15'),
    cpf: '12345678901',
    endereco: {
      street: 'Rua das Flores',
      cep: '12345-678',
      bairro: 'Jardim das Rosas',
      cidade: 'São Paulo',
      estado: 'SP',
    },
  },
  {
    id: 2,
    ativo: false,
    imagemUrl: 'https://avatars.githubusercontent.com/u/40415753?v=4',
    nome: 'Mariana Costa',
    email: 'mariana.costa@example.com',
    dataContratacao: new Date('2018-06-23'),
    cpf: '23456789012',
    endereco: {
      street: 'Avenida Paulista',
      cep: '87654-321',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
    },
  },
  {
    id: 3,
    ativo: true,
    imagemUrl: 'https://avatars.githubusercontent.com/u/3?v=4',
    nome: 'João Pereira',
    email: 'joao.pereira@example.com',
    dataContratacao: new Date('2019-11-30'),
    cpf: '34567890123',
    endereco: {
      street: 'Rua dos Pinheiros',
      cep: '45678-123',
      bairro: 'Pinheiros',
      cidade: 'São Paulo',
      estado: 'SP',
    },
  },
  {
    id: 4,
    ativo: false,
    imagemUrl: 'https://avatars.githubusercontent.com/u/8?v=4',
    nome: 'Ana Oliveira',
    email: 'ana.oliveira@example.com',
    dataContratacao: new Date('2021-04-20'),
    cpf: '45678901234',
    endereco: {
      street: 'Rua do Comércio',
      cep: '65432-111',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
    },
  },
  {
    id: 5,
    ativo: true,
    imagemUrl: 'https://avatars.githubusercontent.com/u/5?v=4',
    nome: 'Roberto Souza',
    email: 'roberto.souza@example.com',
    dataContratacao: new Date('2017-07-10'),
    cpf: '56789012345',
    endereco: {
      street: 'Avenida das Américas',
      cep: '87654-210',
      bairro: 'Barra da Tijuca',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
    },
  },
  {
    id: 6,
    ativo: false,
    imagemUrl: 'https://avatars.githubusercontent.com/u/7?v=4',
    nome: 'Lauro Mendes Fernandes Marques da Silva Lima',
    email: 'lauro.mendes@example.com',
    dataContratacao: new Date('2022-02-28'),
    cpf: '67890123456',
    endereco: {
      street: 'Alameda Santos',
      cep: '12345-210',
      bairro: 'Jardins',
      cidade: 'São Paulo',
      estado: 'SP',
    },
  },
];

@Component({
  standalone: true,
  selector: 'app-funcionario-lista',
  templateUrl: './funcionario-lista.component.html',
  styleUrls: ['./funcionario-lista.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlPt }],
})
export class FuncionarioListComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  // Colunas exibidas na tabela
  displayedColumns: string[] = [
    'toggle',
    'imagemUrl',
    'nome',
    'email',
    'dataContratacao',
    'cpf',
    'endereco',
    'apagar',
  ];

  // Fonte de dados para a tabela
  dataSource = new MatTableDataSource<Funcionario>();

  // Armazena os IDs dos funcionários removidos
  idsRemovidos: Set<number> = new Set();

  // Gerenciamento de assinaturas
  private subscription: Subscription = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator; 
  @ViewChild(MatSort) sort!: MatSort; 

  @Input() atualizarEvento: boolean = false; // Entrada para atualizar a lista de funcionários

  constructor(private funcionarioService: FuncionarioService) {}

  ngOnInit() {
    // Inscrição no serviço de funcionários para carregar dados
    this.subscription.add(
      this.funcionarioService.funcionarios$.subscribe((funcionarios) => {
        this.carregarFuncionarios(funcionarios);
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Atualiza a lista de funcionários quando o input atualizarEvento muda
    if (changes['atualizarEvento'] && changes['atualizarEvento'].currentValue) {
      this.carregarFuncionarios(
        this.funcionarioService.listarTodosFuncionarios()
      );
    }
  }

  ngAfterViewInit() {
    // Configura o paginator e a ordenação para a tabela após a inicialização da view
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Carrega os funcionários na tabela, incluindo dados mock
  carregarFuncionarios(funcionarios: Funcionario[]) {
    const todosFuncionarios = [...MOCK_FUNCIONARIOS, ...funcionarios].filter(
      (funcionario) => !this.idsRemovidos.has(funcionario.id)
    );
    this.dataSource.data = this.removerDuplicatasPorId(todosFuncionarios);
  }

  // Confirma a remoção do funcionário se ele estiver desativado
  confirmRemoveFuncionario(funcionario: Funcionario) {
    if (!funcionario.ativo) {
      this.removeFuncionario(funcionario);
    }
  }

  // Alterna o status de ativo do funcionário
  toggleFuncionarioStatus(funcionario: Funcionario) {
    funcionario.ativo = !funcionario.ativo;
    this.funcionarioService.atualizarFuncionario(funcionario);
    this.dataSource.data = [...this.dataSource.data];
  }

  // Remove o funcionário da lista e do serviço
  private removeFuncionario(funcionario: Funcionario) {
    if (funcionario && funcionario.id) {
      this.funcionarioService.removerFuncionario(funcionario.id);
      this.idsRemovidos.add(funcionario.id);
      this.carregarFuncionarios(
        this.funcionarioService.listarTodosFuncionarios()
      );
    } else {
      console.error('Funcionário inválido:', funcionario);
    }
  }

  // Remove duplicatas de funcionários baseadas no ID
  private removerDuplicatasPorId(funcionarios: Funcionario[]): Funcionario[] {
    const uniqueIds = new Set();
    return funcionarios.filter((funcionario) => {
      if (uniqueIds.has(funcionario.id)) {
        return false;
      } else {
        uniqueIds.add(funcionario.id);
        return true;
      }
    });
  }

  ngOnDestroy() {
    // Desinscreve-se do serviço ao destruir o componente
    this.subscription.unsubscribe();
  }

  // Gera um tooltip completo para o endereço do funcionário
  getEnderecoTooltip(endereco: any): string {
    const enderecoCompleto = `${endereco.street}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}`;
    return enderecoCompleto.length > 40 ? enderecoCompleto : '';
  }

  // Verifica se o tooltip do endereço deve ser desativado
  isEnderecoTooltipDisabled(endereco: any): boolean {
    const enderecoCompleto = `${endereco.street}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}`;
    return enderecoCompleto.length <= 40;
  }

  // Gera um tooltip para o botão de excluir com base no status ativo do funcionário
  getDeleteTooltip(ativo: boolean): string {
    return ativo
      ? 'Somente funcionários desativados podem ser excluídos.'
      : 'Excluir funcionário';
  }

  // Formata o CPF com pontuação
  formatCpf(cpf: string): string {
    if (!cpf) return '';
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return cpf;
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}