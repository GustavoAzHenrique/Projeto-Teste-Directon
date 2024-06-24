import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioFormComponent } from './registro.component';

describe('RegistroComponent', () => {
  let component: FuncionarioFormComponent;
  let fixture: ComponentFixture<FuncionarioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionarioFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuncionarioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
