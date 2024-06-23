import { Component, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import {
  Funcionario,
  FuncionarioService,
} from '../services/funcionario-service/funcionario.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
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
    MatIcon,
    MatTooltipModule
  ],
  providers: [provideNativeDateAdapter()],
})
export class FuncionarioFormComponent {
  funcionarioForm!: FormGroup;
  showSuccessMessage: boolean = false;

  @Output()
  atualizarLista = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private funcionarioService: FuncionarioService
  ) {
    this.createForm();
  }

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
  }

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
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.funcionarioForm.valid) {
      const novoFuncionario: Funcionario = this.funcionarioForm.value;
      this.funcionarioService.cadastrarFuncionario(novoFuncionario);
      this.atualizarLista.emit();
      this.resetForm();
    }
  }

  formControl(control: string): AbstractControl {
    return this.funcionarioForm.controls[control];
  }
}
