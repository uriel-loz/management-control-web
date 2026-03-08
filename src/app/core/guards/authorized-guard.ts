import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthCheckService } from '../services/auth-check.service';
import { catchError, map, of } from 'rxjs';

export const authorizedGuard: CanActivateFn = (route, state) => {
  const authCheckService = inject(AuthCheckService);
  const router = inject(Router);

  return authCheckService.isAuthorized(route.routeConfig?.path).pipe(
    map(isAuthorized => {
      if (isAuthorized) {
        return true;
      }

      router.navigate(['/dashboard/home']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/dashboard/home']);
      return of(false);
    })
  );
};
