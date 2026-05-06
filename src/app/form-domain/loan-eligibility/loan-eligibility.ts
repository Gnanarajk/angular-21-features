import { Component, computed, effect, OnInit, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { INITIAL_STATE } from '@ngrx/store';

interface LoanEligibilityForm {
  monthlyIncome: FormControl<number | null>;
  currentDebt: FormControl<number | null>;
}

interface LoanEligibilityValue {
  monthlyIncome: number | null;
  currentDebt: number | null;
}

@Component({
  selector: 'app-loan-eligibility',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './loan-eligibility.html',
  styleUrl: './loan-eligibility.scss',
})
export class LoanEligibility {
  monthlyIncome = signal<number>(0);
  currentDebt = signal<number>(0);
  loanForm: FormGroup;
  loanData = signal<LoanEligibilityValue>({ monthlyIncome: 0, currentDebt: 0 });

  constructor(private fb: FormBuilder) {
    this.loanForm = this.fb.nonNullable.group<LoanEligibilityForm>(
      {
        monthlyIncome: new FormControl(0, [Validators.required, Validators.min(0)]),
        currentDebt: new FormControl(0, [Validators.required, Validators.min(0)]),
      },
      { validators: this.debtLessThanIncomeValidator },
    );

    this.loanForm.valueChanges.subscribe((data) => {
      this.loanData.set({
        monthlyIncome: data.monthlyIncome ?? 0,
        currentDebt: data.currentDebt ?? 0,
      });
    });

    effect(() => {
      console.log('Risk', this.riskLevel());
    });
  }

  debtLessThanIncomeValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const income = control.get('monthlyIncome')?.value;
    const debt = control.get('currentDebt')?.value;

    return income > 0 && debt > income ? { moreDebt: true } : null;
  };

  maxEligibility = computed(() => {
    const data = this.loanData(); // Call the signal here
    if (!data) return 0; // Safety guard
    const { monthlyIncome, currentDebt } = data;
    const calc = ((monthlyIncome ?? 0) - (currentDebt ?? 0)) * 8;
    return Math.max(0, calc);
  });

  riskLevel = computed(() => {
    const maxElig = this.maxEligibility();
    if (maxElig > 50000) return 'Low Risk';
    else if (maxElig > 20000) return 'Medium Risk';
    else return 'High Risk';
  });

  reset() {
    this.loanForm.reset({ monthlyIncome: 0, currentDebt: 0 });
    // this.monthlyIncome.set(0);
    // this.currentDebt.set(0);
  }
}
