import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  }
  // Optionally:
  ,{ path: '', pathMatch: 'full', redirectTo: 'auth/signup' }
  // ,{ path: '**', redirectTo: 'auth/signup' }
];