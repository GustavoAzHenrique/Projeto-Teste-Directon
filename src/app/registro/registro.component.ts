import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { Funcionario, FuncionarioService } from '../services/funcionario-service/funcionario.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatDatepickerModule, MatIcon],
  providers: [provideNativeDateAdapter()],
})
export class FuncionarioFormComponent {
  funcionarioForm!: FormGroup;
  
  @Output()
  atualizarLista = new EventEmitter<boolean>;

  constructor(private fb: FormBuilder, private funcionarioService: FuncionarioService) {
    this.resetForm()
  }

  resetForm() {
    this.funcionarioForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dataContratacao: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      endereco: this.fb.group({
        street: ['', Validators.required],
        cep: ['', Validators.required],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        estado: ['', Validators.required],
      }),
      photo: [null],
      active: [true]
    });
  }

  onSubmit() {
    if (this.funcionarioForm.valid) {
      const novoFuncionario: Funcionario = this.funcionarioForm.value;
      this.funcionarioService.cadastrarFuncionario(novoFuncionario);
      this.atualizarLista.emit(true);
      this.funcionarioForm.reset();
    }
  }

  formControl(control: string): AbstractControl {
    return this.funcionarioForm.controls[control];
  }
}
