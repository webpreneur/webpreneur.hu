import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ContainerComponent, AlertComponent, RowComponent } from '@coreui/angular';

import { ProductForm } from '../ui/product-form/product-form';
import { Products } from '../data-access/products';

@Component({
  selector: 'webpreneur-product-create-page',
  imports: [ProductForm, ContainerComponent, AlertComponent, RowComponent],
  templateUrl: './product-create-page.html',
  styleUrl: './product-create-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCreatePage {
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);

  readonly #products = inject(Products);

  onSubmitted(productData: { name: string; description: string; price: number }): void {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);
    this.#products.createProduct(productData).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Termék sikeresen létrehozva');
      },
      error: (err: unknown) => {
        const message =
          (err as { error?: { message?: string }; message?: string }).error?.message ??
          (err as { message?: string }).message ??
          'Termék létrehozása sikertelen';
        this.error.set(message);
        this.loading.set(false);
      },
    });
  }
}