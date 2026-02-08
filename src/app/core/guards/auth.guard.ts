import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/landing/services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackbarService = inject(SnackbarService);

  return authService.isAuthenticated().pipe(
    map(isAuth => {
      if (isAuth) {
        return true;
      }

      snackbarService.error('Sesión expirada. Por favor, inicia sesión nuevamente');
      localStorage.clear();
      router.navigate(['']);
      return false;
    }),
    catchError(() => {
      snackbarService.error('Error al verificar autenticación');
      localStorage.clear();
      router.navigate(['']);
      return of(false);
    })
  );
};
