import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/home/home/home').then(m => m.Home)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'products',
    children: [
      {
        path: 'create',
        loadComponent: () =>
          import('./features/products/product-create-page/product-create-page').then(m => m.ProductCreatePage)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];