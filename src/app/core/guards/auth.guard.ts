import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { catchError, map, of } from 'rxjs';
import { AuthCheckService } from '../services/auth-check.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authCheckService = inject(AuthCheckService);
  const router = inject(Router);
  const snackbarService = inject(NotificationService);

  return authCheckService.isAuthenticated().pipe(
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
