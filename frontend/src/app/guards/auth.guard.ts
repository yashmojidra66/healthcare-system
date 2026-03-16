import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const role = auth.currentUser()?.role;
  const path = route.routeConfig?.path ?? '';

  // Admin stays in /admin only
  if (role === 'admin' && path !== 'admin') {
    router.navigate(['/admin']);
    return false;
  }

  // Doctor stays in /doctor-portal only
  if (role === 'doctor' && path !== 'doctor-portal') {
    router.navigate(['/doctor-portal']);
    return false;
  }

  return true;
};
