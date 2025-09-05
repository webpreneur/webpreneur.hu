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

  onSubmitted(productData: { name: string; description: string; price: number; image?: File }): void {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);
    
    const { image, ...productInfo } = productData;
    
    this.#products.createProduct(productInfo).subscribe({
      next: (createdProduct) => {
        // If image is provided, upload it after product creation
        if (image) {
          this.#products.uploadProductImage(createdProduct.id, image).subscribe({
            next: () => {
              this.loading.set(false);
              this.success.set('Termék és kép sikeresen feltöltve');
            },
            error: (err: unknown) => {
              const message =
                (err as { error?: { message?: string }; message?: string }).error?.message ??
                (err as { message?: string }).message ??
                'Kép feltöltése sikertelen';
              this.error.set(`Termék létrehozva, de ${message}`);
              this.loading.set(false);
            }
          });
        } else {
          this.loading.set(false);
          this.success.set('Termék sikeresen létrehozva');
        }
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