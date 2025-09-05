import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ContainerComponent, AlertComponent, RowComponent } from '@coreui/angular';

import { LoginForm } from '../ui/login-form/login-form';
import { Auth } from '../../../../core/auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'webpreneur-login-page',
  imports: [LoginForm, ContainerComponent, AlertComponent, RowComponent],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);

  readonly #auth = inject(Auth);
  readonly #router = inject(Router);

  onSubmitted(credentials: { email: string; password: string }): void {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);
    
    // Map email to username for Auth service
    const authCredentials = {
      email: credentials.email,
      password: credentials.password
    };
    
    console.log('Sending login credentials:', { email: credentials.email, password: '***' });
    
    this.#auth.login(authCredentials).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Sikeres bejelentkezés');
        // Redirect to home page after successful login
        setTimeout(() => {
          this.#router.navigate(['/']);
        }, 1500);
      },
      error: (err: unknown) => {
        const message =
          (err as { error?: { message?: string }; message?: string }).error?.message ??
          (err as { message?: string }).message ??
          'Bejelentkezés sikertelen';
        this.error.set(message);
        this.loading.set(false);
      },
    });
  }
}