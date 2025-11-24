import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TenantService } from '../services/tenant.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutGuardService {
  constructor(
    private tenantService: TenantService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const tenant = this.tenantService.getTenant();
    if (!tenant) {
      console.error('No tenant configured');
      return false;
    }
    return true;
  }
}

export const layoutGuard: CanActivateFn = (route, state) => {
  const injector = (route as any).injector;
  const guardService = injector.get(LayoutGuardService);
  return guardService.canActivate();
};
