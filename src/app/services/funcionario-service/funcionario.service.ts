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
  providedIn: 'root',
})
export class FuncionarioService {
  private funcionarios: Funcionario[] = [];
  private nextId = 1;
  private storageAvailable: boolean;
  private readonly STORAGE_KEY = 'funcionarios';

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
          this.nextId = Math.max(...this.funcionarios.map((f) => f.id)) + 1;
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
    const funcionariosJson = localStorage.getItem(this.STORAGE_KEY);
    if (funcionariosJson) {
      return JSON.parse(funcionariosJson).map((funcionario: any) => {
        return {
          ...funcionario,
          dataContratacao: new Date(funcionario.dataContratacao),
        };
      });
    }
    return [];
  }

  cadastrarFuncionario(funcionario: Funcionario) {
    funcionario.id = this.nextId++;
    this.funcionarios.push(funcionario);
    this.saveFuncionariosToStorage();
  }

  removerFuncionario(id: number) {
    let funcionarios = this.listarTodosFuncionarios();
    funcionarios = funcionarios.filter((f) => f.id !== id);
    this.saveToStorage(funcionarios);
  }

  toggleAtivo(id: number) {
    const funcionario = this.funcionarios.find((f) => f.id === id);
    if (funcionario) {
      funcionario.ativo = !funcionario.ativo;
      localStorage.setItem('funcionarios', JSON.stringify(this.funcionarios));
    }
  }

  atualizarFuncionario(funcionario: Funcionario) {
    let funcionarios = this.listarTodosFuncionarios();
    const index = funcionarios.findIndex((f) => f.id === funcionario.id);
    if (index !== -1) {
      funcionarios[index] = funcionario;
    } else {
      funcionarios.push(funcionario);
    }
    this.saveToStorage(funcionarios);
  }

  private saveToStorage(funcionarios: Funcionario[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(funcionarios));
  }
}
