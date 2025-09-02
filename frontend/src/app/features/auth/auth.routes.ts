import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'signup',
    loadComponent: () =>
      import('./signup/signup-page/signup-page').then(m => m.SignupPage)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login-page/login-page').then(m => m.LoginPage)
  }
  // Optionally: { path: '', pathMatch: 'full', redirectTo: 'signup' }
];