import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ContainerComponent } from '@coreui/angular';

import { Products } from '../data-access/products';
import { API_BASE_URL } from '../../../core/config/api.tokens';

@Component({
  selector: 'webpreneur-product-list-page',
  imports: [
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ContainerComponent,
    RouterLink
  ],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.scss'
})
export class ProductListPage implements OnInit {
  readonly #productsService = inject(Products);
  readonly #apiBaseUrl = inject(API_BASE_URL);
  
  products = signal<{ id: number; name: string; description: string; price: number; userId: number; imageExists?: boolean; imageUrl?: string | null }[]>([]);

  get apiBaseUrl(): string {
    return this.#apiBaseUrl;
  }

  ngOnInit(): void {
    this.#loadProducts();
  }

  #loadProducts(): void {
    this.#productsService.getProducts().subscribe({
      next: (products) => {
        console.log({products});
        this.products.set(products);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }
}
