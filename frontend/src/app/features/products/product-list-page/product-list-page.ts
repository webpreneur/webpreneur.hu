import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ContainerComponent } from '@coreui/angular';

import { Products } from '../data-access/products';

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
  
  products = signal<{ id: number; name: string; description: string; price: number; userId: number }[]>([]);

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
