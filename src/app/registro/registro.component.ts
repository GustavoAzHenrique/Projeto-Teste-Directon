import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { Funcionario, FuncionarioService } from '../services/funcionario-service/funcionario.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatIconModule,
    MatTooltipModule
  ],
  providers: [provideNativeDateAdapter()],
})
export class FuncionarioFormComponent {
  // FormGroup para gerenciar o formulário de funcionário
  funcionarioForm!: FormGroup;
  
  // Flags para exibir mensagens de sucesso
  showFileUploadSuccessMessage: boolean = false;
  showFormSubmitSuccessMessage: boolean = false;

  @Output()
  atualizarLista = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private funcionarioService: FuncionarioService
  ) {
    this.createForm();
  }

  // Método para criar o formulário com validações
  createForm() {
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
      imagemUrl: [''],
      ativo: [true],
    });
  }

  // Método para redefinir o formulário e marcar controles como intocados e pristine
  resetForm() {
    this.funcionarioForm.reset({
      nome: '',
      email: '',
      dataContratacao: '',
      cpf: '',
      endereco: {
        street: '',
        cep: '',
        bairro: '',
        cidade: '',
        estado: '',
      },
      imagemUrl: '',
      ativo: true
    });
    this.markAllControlsAsUntouchedAndPristine(this.funcionarioForm);
  }

  // Marca todos os controles do formulário como pristine e untouched
  markAllControlsAsUntouchedAndPristine(control: AbstractControl) {
    if (control instanceof FormControl) {
      control.markAsPristine();
      control.markAsUntouched();
      control.setErrors(null);
    } else if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(key => {
        this.markAllControlsAsUntouchedAndPristine(control.controls[key]);
      });
    }
  }

  // Método para lidar com a alteração do arquivo (upload de imagem)
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.funcionarioForm.patchValue({
          imagemUrl: base64String,
        });
        this.showFileUploadSuccessMessage = true;
        setTimeout(() => {
          this.showFileUploadSuccessMessage = false;
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  }

  // Método de envio do formulário
  onSubmit() {
    if (this.funcionarioForm.valid) {
      const novoFuncionario: Funcionario = this.funcionarioForm.value;
      this.funcionarioService.cadastrarFuncionario(novoFuncionario);
      this.atualizarLista.emit(true);
      this.resetForm();
      this.showFormSubmitSuccessMessage = true;
      setTimeout(() => {
        this.showFormSubmitSuccessMessage = false;
      }, 3000);
    }
  }

  // Método para obter o controle do formulário por nome
  formControl(control: string): AbstractControl {
    return this.funcionarioForm.controls[control];
  }
}
