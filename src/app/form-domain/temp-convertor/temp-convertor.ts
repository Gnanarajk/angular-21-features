import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { tap } from 'rxjs';

interface TempConvertorForm {
  celcius: FormControl<number | null>;
  fahrenheit: FormControl<number | null>;
}

@Component({
  selector: 'app-temp-convertor',
  imports: [ReactiveFormsModule],
  templateUrl: './temp-convertor.html',
  styleUrl: './temp-convertor.scss',
})
export class TempConvertor implements OnInit {
  tempConvertorForm: FormGroup<TempConvertorForm>;

  constructor(private fb: FormBuilder) {
    this.tempConvertorForm = this.fb.nonNullable.group<TempConvertorForm>({
      celcius: new FormControl<number>(0),
      fahrenheit: new FormControl<number>(32),
    });
  }

  ngOnInit(): void {
    this.tempConvertorForm.get('fahrenheit')?.valueChanges.subscribe((data) => {
      const celControl = this.tempConvertorForm.get('celcius');
      if (data !== null && Number.isFinite(+data)) {
        const celValue = ((data - 32) * 5) / 9;
        celControl?.setValue(parseFloat(celValue.toFixed(1)), { emitEvent: false });
      }
    });

    this.tempConvertorForm.get('celcius')?.valueChanges.subscribe((data) => {
      const fahControl = this.tempConvertorForm.get('fahrenheit');
      if (data !== null && Number.isFinite(+data)) {
        const fahValue = (data * 9) / 5 + 32;
        fahControl?.setValue(parseFloat(fahValue.toFixed(1)), { emitEvent: false });
      }
    });
  }
}
