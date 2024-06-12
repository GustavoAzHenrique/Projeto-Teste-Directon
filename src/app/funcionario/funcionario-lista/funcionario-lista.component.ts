import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableDataSource, MatTableModule} from '@angular/material/table'

@Component({
  selector: 'app-funcionario-lista',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    BrowserAnimationsModule,
    CommonModule,
    MatTableModule,
    MatTableDataSource
  ],
  templateUrl: './funcionario-lista.component.html',
  styleUrl: './funcionario-lista.component.scss'
})
export class FuncionarioListaComponent {
  displayedColumns: string[] = ['active', 'nome', 'dataContratacao'];
  dataSource = new MatTableDataSource<Funcionario>([
    // Exemplo de dados, substitua por dados reais
    {
      active: true,
      photo: null,
      nome: 'John Doe',
      email: 'john@example.com',
      dataContratacao: new Date('2023-05-01'),
      cpf: '12345678901',
      endereco: {
        street: '123 Main St',
        cep: '12345-678',
        bairro: 'Centro',
        cidade: 'cidade',
        estado: 'estado'
      }
    },
    {
      active: false,
      photo: null,
      nome: 'Jane Doe',
      email: 'jane@example.com',
      dataContratacao: new Date('2023-05-01'),
      cpf: '98765432109',
      endereco: {
        rua: '456 Main St',
        cep: '54321-098',
        bairro: 'Bairro',
        cidade: 'cidade',
        estado: 'estado'
      }
    }
  ]);

  constructor(private dialog: MatDialog) {}

  viewDetails(funcionario: FuncionarioListaComponent) {
    if (funcionario.active) {
      this.dialog.open(FuncionarioListaComponent, {
        data: funcionario,
        width: '500px'
      });
    }
  }

}
