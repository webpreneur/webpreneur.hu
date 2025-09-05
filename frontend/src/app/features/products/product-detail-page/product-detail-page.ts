import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ContainerComponent } from '@coreui/angular';

import { Products } from '../data-access/products';
import { API_BASE_URL } from '../../../core/config/api.tokens';

@Component({
  selector: 'webpreneur-product-detail-page',
  imports: [
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ContainerComponent
  ],
  templateUrl: './product-detail-page.html',
  styleUrl: './product-detail-page.scss'
})
export class ProductDetailPage implements OnInit {
  readonly #productsService = inject(Products);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #apiBaseUrl = inject(API_BASE_URL);
  
  product = signal<{ id: number; name: string; description: string; price: number; userId: number; imageExists?: boolean; imageUrl?: string | null } | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  get apiBaseUrl(): string {
    return this.#apiBaseUrl;
  }

  ngOnInit(): void {
    const productId = this.#route.snapshot.paramMap.get('id');
    if (productId) {
      this.#loadProduct(Number(productId));
    } else {
      this.#router.navigate(['/products']);
    }
  }

  #loadProduct(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.#productsService.getProduct(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error.set('Hiba történt a termék betöltése során');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.#router.navigate(['/products']);
  }
}