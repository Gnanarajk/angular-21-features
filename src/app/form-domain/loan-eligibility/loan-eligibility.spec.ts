import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanEligibility } from './loan-eligibility';

describe('LoanEligibility', () => {
  let component: LoanEligibility;
  let fixture: ComponentFixture<LoanEligibility>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanEligibility],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanEligibility);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return Low Risk', () => {
    component.loanForm.setValue({ monthlyIncome: 10000, currentDebt: 900 });
    expect(component.riskLevel()).toBe('Low Risk');
  });
  it('should return High Risk', () => {
    component.loanForm.setValue({ monthlyIncome: 1000, currentDebt: 10000 });
    expect(component.riskLevel()).toBe('High Risk');
  });
  it('should return Medium Risk', () => {
    component.loanForm.setValue({ monthlyIncome: 5000, currentDebt: 500 });
    expect(component.riskLevel()).toBe('Medium Risk');
  });
  it('should reset the form and signals', () => {
    component.loanForm.setValue({ monthlyIncome: 10000, currentDebt: 900 });
    component.reset();
    expect(component.loanForm.value).toEqual({ monthlyIncome: 0, currentDebt: 0 });
    expect(component.loanData()).toEqual({ monthlyIncome: 0, currentDebt: 0 });
  });
  it('should calculate maxEligibility correctly when form changes', () => {
    // 1. Arrange: Define high-income, low-debt values
    const income = 10000;
    const debt = 2000;
    const expectedEligibility = (income - debt) * 8; // 64,000

    // 2. Act: Patch the form values
    // This triggers the .subscribe() -> which updates this.loanData()
    component.loanForm.patchValue({
      monthlyIncome: income,
      currentDebt: debt,
    });

    // 3. Assert: Verify the signals reacted
    // Check the intermediary signal
    expect(component.loanData()).toEqual({ monthlyIncome: income, currentDebt: debt });

    // Check the computed signal
    expect(component.maxEligibility()).toBe(expectedEligibility);

    // Check the risk level chain
    expect(component.riskLevel()).toBe('Low Risk');
  });

  it('should default to 0 using ?? operator when form values are null', () => {
    // Act: Simulate clearing the form
    component.loanForm.patchValue({ monthlyIncome: null, currentDebt: null });

    // Assert: maxEligibility should be (0 - 0) * 8 = 0
    expect(component.maxEligibility()).toBe(0);
  });
  it('should return 0 for maxEligibility if loanData is null/undefined', () => {
    // 1. Force the signal to a null state
    // (Assuming your signal type allows null or you cast it for the test)
    component.loanData.set(null as any);

    // 2. Access maxEligibility
    const result = component.maxEligibility();

    // 3. Assert the safety guard caught it
    expect(result).toBe(0);
  });
  describe('maxEligibility Calculation Logic', () => {
    it('1. should calculate correctly with valid numbers', () => {
      // Path: (10000 - 2000) * 8 = 64,000
      component.loanForm.patchValue({ monthlyIncome: 10000, currentDebt: 2000 });
      expect(component.maxEligibility()).toBe(64000);
    });

    it('2. should use fallback 0 when income is null', () => {
      // Path: (null ?? 0 - 1000) * 8 = -8000 -> clamped to 0
      component.loanForm.patchValue({ monthlyIncome: null, currentDebt: 1000 });
      expect(component.maxEligibility()).toBe(0);
    });

    it('3. should use fallback 0 when debt is null', () => {
      // Path: (5000 - null ?? 0) * 8 = 40,000
      component.loanForm.patchValue({ monthlyIncome: 5000, currentDebt: null });
      expect(component.maxEligibility()).toBe(40000);
    });

    it('4. should handle 0 as a valid input (not triggering fallback)', () => {
      // This proves ?? is used correctly instead of ||
      // Path: (0 - 0) * 8 = 0
      component.loanForm.patchValue({ monthlyIncome: 0, currentDebt: 0 });
      expect(component.maxEligibility()).toBe(0);
    });
  });
});
