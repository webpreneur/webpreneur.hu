import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import {
  ButtonDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
} from '@coreui/angular';

@Component({
  selector: 'webpreneur-login-form',
  imports: [
    ButtonDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginForm {
  private readonly fb = inject(NonNullableFormBuilder);
  readonly submitted = output<{ email: string; password: string }>();

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) { return; }
    this.submitted.emit(this.form.getRawValue());
  }
}