import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from './auth';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  // If already authenticated, allow access
  if (authService.isAuthenticated()) {
    return true;
  }

  // Check auth status with server
  return authService.checkAuthStatus().pipe(
    map(() => true),
    catchError(() => {
      // Redirect to login if not authenticated
      router.navigate(['/auth/login']);
      return of(false);
    })
  );
};
