import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/data/auth-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  errorMessage = '';
  loading = false;

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/users']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/users']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Invalid username or password.';
      },
    });
  }
}
