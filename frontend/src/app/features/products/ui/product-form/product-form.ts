import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import {
  ButtonDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  FormTextDirective,
} from '@coreui/angular';

@Component({
  selector: 'webpreneur-product-form',
  imports: [
    ButtonDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormTextDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductForm {
  readonly #fb = inject(NonNullableFormBuilder);
  readonly submitted = output<{ name: string; description: string; price: number }>();

  readonly form = this.#fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  submit(): void {
    if (this.form.invalid) { return; }
    this.submitted.emit(this.form.getRawValue());
  }
}