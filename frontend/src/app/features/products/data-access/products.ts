import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.tokens';

@Injectable({
  providedIn: 'root',
})
export class Products {
  readonly #http = inject(HttpClient);
  readonly #apiBaseUrl = inject(API_BASE_URL);

  createProduct(data: {
    name: string;
    description: string;
    price: number;
  }): Observable<{ id: number; name: string; description: string; price: number; userId: number }> {
    return this.#http.post<{
      id: number;
      name: string;
      description: string;
      price: number;
      userId: number;
    }>(`${this.#apiBaseUrl}/products`, data);
  }

  getProducts(): Observable<
    { id: number; name: string; description: string; price: number; userId: number }[]
  > {
    return this.#http.get<
      { id: number; name: string; description: string; price: number; userId: number }[]
    >(`${this.#apiBaseUrl}/products`);
  }
}
