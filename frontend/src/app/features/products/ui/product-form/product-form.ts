import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
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
  readonly submitted = output<{ name: string; description: string; price: number; image?: File }>();

  selectedFile = signal<File | null>(null);

  readonly form = this.#fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Csak JPEG, JPG, PNG, WEBP formátumok támogatottak!');
        target.value = '';
        return;
      }
      
      // Validate file size (500KB)
      if (file.size > 500000) {
        alert('A fájl mérete nem lehet nagyobb 500KB-nál!');
        target.value = '';
        return;
      }
      
      this.selectedFile.set(file);
    } else {
      this.selectedFile.set(null);
    }
  }

  submit(): void {
    if (this.form.invalid) { return; }
    
    const formData = this.form.getRawValue();
    const selectedFile = this.selectedFile();
    
    this.submitted.emit({
      ...formData,
      image: selectedFile || undefined
    });
  }
}