import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempConvertor } from './temp-convertor';
import { ReactiveFormsModule } from '@angular/forms';

describe('TempConvertor', () => {
  let component: TempConvertor;
  let fixture: ComponentFixture<TempConvertor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempConvertor, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TempConvertor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should convert 0 celc to 21 farh', () => {
    const celInput = component.tempConvertorForm.get('celcius');
    const fahInput = component.tempConvertorForm.get('fahrenheit');

    celInput?.setValue(0);
    expect(fahInput?.value).toEqual(32);
  });

  it('should convert 100 celc to 212 farh', () => {
    const celInput = component.tempConvertorForm.get('celcius');
    const fahInput = component.tempConvertorForm.get('fahrenheit');

    celInput?.setValue(100);
    expect(fahInput?.value).toEqual(212);
  });

  it('should convert 32 farh to 0 celc', () => {
    const celInput = component.tempConvertorForm.get('celcius');
    const fahInput = component.tempConvertorForm.get('fahrenheit');

    fahInput?.setValue(32);
    expect(celInput?.value).toEqual(0);
  });

  it('should not convert non number value and does not throw error', () => {
    const celInput = component.tempConvertorForm.get('celcius');
    const fahInput = component.tempConvertorForm.get('fahrenheit');

    expect(() => {
      fahInput?.setValue('abc' as any);
    }).not.toThrow();
    expect(celInput?.value).toEqual(0);
  });
});
