import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { TenantService } from '../../services/tenant.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = signal(true);
  testCredentials: any[] = [];
  selectedTestCredential = signal('');

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    public tenantService: TenantService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadTestCredentials();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  private loadTestCredentials(): void {
    this.testCredentials = this.authService.getTestCredentials()
      .filter(cred => cred.tenant === this.tenantService.getTenant()?.name);
  }

  useTestCredential(credential: any): void {
    this.loginForm.patchValue({
      email: credential.email,
      password: credential.password
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    const success = await this.authService.login(this.loginForm.value);

    if (success) {
      this.snackBar.open('Login successful!', 'Close', { duration: 2000 });
      
      // Redirect to intended destination or dashboard
      const redirectUrl = sessionStorage.getItem('redirectUrl') || '/dashboard';
      sessionStorage.removeItem('redirectUrl');
      this.router.navigate([redirectUrl]);
    } else {
      this.snackBar.open(this.authService.error$() || 'Login failed', 'Close', { duration: 3000 });
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
