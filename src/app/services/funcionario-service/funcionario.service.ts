import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Interface que define a estrutura de um Funcionário
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
  // BehaviorSubject que armazena a lista de funcionários e emite atualizações
  private funcionariosSubject = new BehaviorSubject<Funcionario[]>([]);
  
  // Observable que expõe a lista de funcionários para assinantes
  funcionarios$ = this.funcionariosSubject.asObservable();
  
  // ID para o próximo funcionário a ser cadastrado
  private nextId = 1;

  // Indica se o LocalStorage está disponível
  private storageAvailable: boolean;

  // Chave para armazenar e recuperar dados no LocalStorage
  private readonly STORAGE_KEY = 'funcionarios';

  constructor() {
    // Verifica a disponibilidade do LocalStorage
    this.storageAvailable = this.checkLocalStorageAvailability();
    
    if (this.storageAvailable) {
      this.loadFuncionariosFromStorage(); // Carrega dados do LocalStorage se disponível
    } else {
      console.warn('LocalStorage is not available. Using in-memory storage.');
    }
  }

  // Verifica se o LocalStorage está disponível e funcional
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

  // Carrega a lista de funcionários do LocalStorage
  private loadFuncionariosFromStorage() {
    if (this.storageAvailable) {
      const storedFuncionarios = localStorage.getItem(this.STORAGE_KEY);
      if (storedFuncionarios) {
        try {
          const funcionarios: Funcionario[] = JSON.parse(storedFuncionarios);
          this.funcionariosSubject.next(funcionarios);
          this.nextId = Math.max(...funcionarios.map(f => f.id)) + 1;
        } catch (error) {
          console.error('Error parsing stored funcionarios:', error);
          this.funcionariosSubject.next([]);
        }
      }
    }
  }

  // Salva a lista de funcionários no LocalStorage
  private saveFuncionariosToStorage() {
    if (this.storageAvailable) {
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(this.funcionariosSubject.value)
      );
    }
  }

  // Retorna todos os funcionários, com data formatada
  listarTodosFuncionarios(): Funcionario[] {
    return this.funcionariosSubject.value.map(funcionario => ({
      ...funcionario,
      dataContratacao: new Date(funcionario.dataContratacao),
    }));
  }

  // Cadastra um novo funcionário na lista
  cadastrarFuncionario(funcionario: Funcionario) {
    funcionario.id = this.nextId++;
    const currentFuncionarios = this.funcionariosSubject.value;
    currentFuncionarios.push(funcionario);
    this.funcionariosSubject.next(currentFuncionarios);
    this.saveFuncionariosToStorage();
  }

  // Remove um funcionário da lista pelo ID
  removerFuncionario(id: number) {
    const updatedFuncionarios = this.funcionariosSubject.value.filter(
      f => f.id !== id
    );
    this.funcionariosSubject.next(updatedFuncionarios);
    this.saveFuncionariosToStorage();
  }

  // Alterna o estado ativo/inativo de um funcionário pelo ID
  toggleAtivo(id: number) {
    const funcionarios = this.funcionariosSubject.value;
    const funcionario = funcionarios.find(f => f.id === id);
    if (funcionario) {
      funcionario.ativo = !funcionario.ativo;
      this.funcionariosSubject.next([...funcionarios]);
      this.saveFuncionariosToStorage();
    }
  }

  // Atualiza os dados de um funcionário existente ou adiciona novo se não existir
  atualizarFuncionario(funcionario: Funcionario) {
    const funcionarios = this.funcionariosSubject.value;
    const index = funcionarios.findIndex(f => f.id === funcionario.id);
    if (index !== -1) {
      funcionarios[index] = funcionario;
    } else {
      funcionarios.push(funcionario);
    }
    this.funcionariosSubject.next([...funcionarios]);
    this.saveFuncionariosToStorage();
  }
}
