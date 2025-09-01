import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'signup',
    loadComponent: () =>
      import('./signup/signup-page/signup-page').then(m => m.SignupPage)
  }
  // Optionally: { path: '', pathMatch: 'full', redirectTo: 'signup' }
];