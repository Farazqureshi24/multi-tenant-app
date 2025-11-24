import { Injectable } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated$()) {
    // Check for required role
    const requiredRole = route.data['role'] as string;
    if (requiredRole && !authService.hasRole(requiredRole as 'admin' | 'user')) {
      router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }

  // Store the intended destination
  sessionStorage.setItem('redirectUrl', state.url);
  router.navigate(['/login']);
  return false;
};

export const guestGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated$()) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
