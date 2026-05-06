import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

interface PercentValue {
  checkVal: boolean;
  alum: number;
  copper: number;
  iron: number;
  validateTotal: ValidationErrors | null;
}

@Component({
  selector: 'app-percent-calc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './percent-calc.html',
  styleUrl: './percent-calc.scss',
})
export class PercentCalc {
  form: FormGroup;
  signalForm = signal<PercentValue[]>([]);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        checkVal: [false],
        alum: [0, Validators.required],
        copper: [0, Validators.required],
        iron: [0, Validators.required],
      },
      { validators: this.validateTotal },
    );
    this.form.valueChanges.subscribe((value) => {
      this.signalForm.set([{ ...value, validateTotal: this.form.errors }]);
    });
  }

  validateNumber(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === '') {
      return null;
    }
    const num = Number(value);
    return !isNaN(num) ? null : { invalidNumber: true };
  }

  validateTotal(group: AbstractControl): ValidationErrors | null {
    const alum = Number(group.get('alum')?.value) || 0;
    const copper = Number(group.get('copper')?.value) || 0;
    const iron = Number(group.get('iron')?.value) || 0;
    const total = alum + copper + iron;
    return total <= 100 ? null : { totalExceeds: true };
  }
}
