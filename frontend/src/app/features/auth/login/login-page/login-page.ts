import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ContainerComponent, AlertComponent, RowComponent } from '@coreui/angular';

import { LoginForm } from '../ui/login-form/login-form';
import { Users } from '../../data-access/users';

@Component({
  selector: 'webpreneur-login-page',
  imports: [LoginForm, ContainerComponent, AlertComponent, RowComponent],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly users = inject(Users);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);

  onSubmitted(credentials: { email: string; password: string }): void {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);
    this.users.loginUser(credentials).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Sikeres bejelentkezés');
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