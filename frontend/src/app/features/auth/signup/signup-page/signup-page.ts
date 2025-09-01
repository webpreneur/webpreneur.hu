import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ContainerComponent, AlertComponent, RowComponent, ColComponent } from '@coreui/angular';

import { SignupForm } from '../ui/signup-form/signup-form';
import { Users } from '../../data-access/users';

@Component({
  selector: 'webpreneur-signup-page',
  imports: [SignupForm, ContainerComponent, AlertComponent, RowComponent, ColComponent],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupPage {
  private readonly users = inject(Users);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);

  onSubmitted(credentials: { email: string; password: string }): void {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);
    this.users.createUser(credentials).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Account created successfully. You can now sign in.');
      },
      error: (err: unknown) => {
        const message =
          (err as { error?: { message?: string }; message?: string }).error?.message ??
          (err as { message?: string }).message ??
          'Signup failed';
        this.error.set(message);
        this.loading.set(false);
      },
    });
  }
}
