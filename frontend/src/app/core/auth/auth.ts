import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { API_BASE_URL } from '../config/api.tokens';

interface LoginCredentials {
  email: string;
  password: string;
}

interface TokenPayload {
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  readonly #http = inject(HttpClient);
  readonly #apiBaseUrl = inject(API_BASE_URL);
  
  #isAuthenticated = signal<boolean>(false);
  #currentUser = signal<TokenPayload | null>(null);

  get isAuthenticated() {
    return this.#isAuthenticated.asReadonly();
  }

  get currentUser() {
    return this.#currentUser.asReadonly();
  }

  login(credentials: LoginCredentials): Observable<{ tokenPayload: TokenPayload }> {
    return this.#http.post<{ tokenPayload: TokenPayload }>(
      `${this.#apiBaseUrl}/auth/login`, 
      credentials,
      { withCredentials: true }
    ).pipe(
      tap(response => {
        this.#isAuthenticated.set(true);
        this.#currentUser.set(response.tokenPayload);
      })
    );
  }

  logout(): Observable<any> {
    return this.#http.post(`${this.#apiBaseUrl}/auth/logout`, {}, 
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.#isAuthenticated.set(false);
        this.#currentUser.set(null);
      })
    );
  }

  checkAuthStatus(): Observable<{ tokenPayload: TokenPayload }> {
    return this.#http.get<{ tokenPayload: TokenPayload }>(
      `${this.#apiBaseUrl}/auth/me`,
      { withCredentials: true }
    ).pipe(
      tap(response => {
        this.#isAuthenticated.set(true);
        this.#currentUser.set(response.tokenPayload);
      })
    );
  }
}
