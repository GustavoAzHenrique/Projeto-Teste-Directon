import { Injectable } from '@angular/core';

export interface Funcionario {
  id: number;
  ativo: boolean;
  imagemUrl?: string;
  nome: string;
  email: string;
  dataContratacao: Date;
  cpf: string;
  endereco: {
    street: string;
    cep: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private funcionarios: Funcionario[] = [];
  private nextId = 1;
  private storageAvailable: boolean;

  constructor() {
    this.storageAvailable = this.checkLocalStorageAvailability();
    if (this.storageAvailable) {
      this.loadFuncionariosFromStorage();
    } else {
      console.warn('LocalStorage is not available. Using in-memory storage.');
    }
  }

  private checkLocalStorageAvailability(): boolean {
    try {
      const storage = window.localStorage;
      const testKey = '__test__';
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  loadFuncionariosFromStorage() {
    if (this.storageAvailable) {
      const storedFuncionarios = localStorage.getItem('funcionarios');
      if (storedFuncionarios) {
        try {
          this.funcionarios = JSON.parse(storedFuncionarios);
          this.nextId = Math.max(...this.funcionarios.map(f => f.id)) + 1;
          this.saveFuncionariosToStorage();
        } catch (error) {
          console.error('Error parsing stored funcionarios:', error);
          this.funcionarios = [];
        }
      }
    }
  }

  private saveFuncionariosToStorage() {
    if (this.storageAvailable) {
      localStorage.setItem('funcionarios', JSON.stringify(this.funcionarios));
    }
  }

  listarTodosFuncionarios(): Funcionario[] {
    return this.funcionarios;
  }

  cadastrarFuncionario(funcionario: Funcionario) {
    funcionario.id = this.nextId++;
    this.funcionarios.push(funcionario);
    this.saveFuncionariosToStorage();
  }

  removerFuncionario(id: number) {
    const index = this.funcionarios.findIndex(f => f.id === id);
    if (index !== -1) {
      this.funcionarios.splice(index, 1);
      this.saveFuncionariosToStorage();
    }
  }

  toggleAtivo(id: number) {
    const funcionario = this.funcionarios.find(f => f.id === id);
    if (funcionario) {
      funcionario.ativo = !funcionario.ativo;
      this.saveFuncionariosToStorage();
    }
  }
}
