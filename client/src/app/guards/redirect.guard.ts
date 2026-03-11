import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { APP_ROUTES } from '../constants/app.routes.constants';

export const redirectGuard: CanActivateFn = () => {
  return inject(Router).createUrlTree([APP_ROUTES.snippets]);
};