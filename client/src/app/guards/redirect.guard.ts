import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { APP_ROUTES } from '../constants/app.routes.constants';

export const redirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Already authenticated — send to the main content
    return router.createUrlTree([APP_ROUTES.snippets]);
  }

  // Not authenticated — send to login
  return router.createUrlTree([APP_ROUTES.login]);
};