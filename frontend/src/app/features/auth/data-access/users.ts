import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.tokens';

@Injectable({
  providedIn: 'root'
})
export class Users {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  createUser(data: { email: string; password: string }): Observable<{ id: string; email: string }> {
    return this.http.post<{ id: string; email: string }>(`${this.apiBaseUrl}/users`, data);
  }

  loginUser(credentials: { email: string; password: string }): Observable<{ token: string; user: { id: string; email: string } }> {
    return this.http.post<{ token: string; user: { id: string; email: string } }>(`${this.apiBaseUrl}/auth/login`, credentials);
  }
}
