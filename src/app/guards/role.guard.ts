import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUserValue;
  const requiredRoles = route.data?.['roles'] as string[];

  if (!user) {
    // No está logueado, redirigir al login
    router.navigate(['/login']);
    return false;
  }

  if (!requiredRoles || requiredRoles.length === 0) {
    // No se requieren roles específicos, permitir acceso
    return true;
  }

  if (authService.hasAnyRole(requiredRoles)) {
    // Tiene el rol requerido, permitir acceso
    return true;
  }

  // No tiene permisos, redirigir a página de no autorizado
  router.navigate(['/unauthorized']);
  return false;
};
