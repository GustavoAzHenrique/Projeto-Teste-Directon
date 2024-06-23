import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';

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
  private funcionariosSubject: BehaviorSubject<Funcionario[]> = new BehaviorSubject<Funcionario[]>([]);
  funcionarios$: Observable<Funcionario[]> = this.funcionariosSubject.asObservable();
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

  private loadFuncionariosFromStorage() {
    if (this.storageAvailable) {
      const storedFuncionarios = localStorage.getItem(this.STORAGE_KEY);
      if (storedFuncionarios) {
        try {
          const funcionarios = JSON.parse(storedFuncionarios);
          this.funcionariosSubject.next(funcionarios);
          this.nextId = Math.max(...funcionarios.map((f: Funcionario) => f.id)) + 1;
        } catch (error) {
          console.error('Error parsing stored funcionarios:', error);
          this.funcionariosSubject.next([]);
        }
      }
    }
  }

  private saveFuncionariosToStorage() {
    if (this.storageAvailable) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.funcionariosSubject.value));
    }
  }

  listarTodosFuncionarios(): Funcionario[] {
    return this.funcionariosSubject.value.map(funcionario => ({
      ...funcionario,
      dataContratacao: new Date(funcionario.dataContratacao),
    }));
  }

  cadastrarFuncionario(funcionario: Funcionario) {
    funcionario.id = this.nextId++;
    const currentFuncionarios = this.funcionariosSubject.value;
    currentFuncionarios.push(funcionario);
    this.funcionariosSubject.next(currentFuncionarios);
    this.saveFuncionariosToStorage();
  }

  removerFuncionario(id: number) {
    const updatedFuncionarios = this.funcionariosSubject.value.filter(f => f.id !== id);
    this.funcionariosSubject.next(updatedFuncionarios);
    this.saveFuncionariosToStorage();
  }

  toggleAtivo(id: number) {
    const funcionarios = this.funcionariosSubject.value;
    const funcionario = funcionarios.find(f => f.id === id);
    if (funcionario) {
      funcionario.ativo = !funcionario.ativo;
      this.funcionariosSubject.next([...funcionarios]);
      this.saveFuncionariosToStorage();
    }
  }

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
