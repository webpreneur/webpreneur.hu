import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import {
  ButtonDirective,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormTextDirective,
} from '@coreui/angular';

@Component({
  selector: 'webpreneur-signup-form',
  imports: [
    ButtonDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormTextDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './signup-form.html',
  styleUrls: ['./signup-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupForm {
  private readonly fb = inject(NonNullableFormBuilder);
  @Output() readonly submitted = new EventEmitter<{ email: string; password: string }>();

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    terms: [false, [Validators.requiredTrue]],
  });

  submit(): void {
    if (this.form.invalid) { return; }
    this.submitted.emit(this.form.getRawValue());
  }
}
