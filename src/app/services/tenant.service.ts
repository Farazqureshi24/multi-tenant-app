import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface TenantConfig {
  id: string;
  name: string;
  domain: string;
  subdomain: string;
  logo: string;
  favicon: string;
  layout: 'sidenav' | 'topnav';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  appName: string;
  description: string;
}

interface TenantsConfigFile {
  tenants: { [key: string]: TenantConfig };
  defaultTenant: string;
}

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private currentTenant = signal<TenantConfig | null>(null);
  private tenantsConfig: TenantsConfigFile | null = null;
  private configLoaded = signal(false);

  currentTenant$ = this.currentTenant.asReadonly();
  configLoaded$ = this.configLoaded.asReadonly();

  isSidenavLayout = computed(() => this.currentTenant()?.layout === 'sidenav');
  isTopnavLayout = computed(() => this.currentTenant()?.layout === 'topnav');

  constructor(private http: HttpClient) {}

  async loadConfiguration(): Promise<void> {
    try {
      this.tenantsConfig = await firstValueFrom(
        this.http.get<TenantsConfigFile>('/tenants-config.json')
      );
      
      const tenantId = this.getCurrentTenantId();
      const tenant = this.tenantsConfig.tenants[tenantId];
      
      if (tenant) {
        this.currentTenant.set(tenant);
        this.applyTheme(tenant);
      } else {
        throw new Error(`Tenant ${tenantId} not found in configuration`);
      }
      
      this.configLoaded.set(true);
    } catch (error) {
      console.error('Failed to load tenant configuration:', error);
      throw error;
    }
  }

  private getCurrentTenantId(): string {
    const hostname = window.location.hostname;
    
    // Extract subdomain from hostname
    // For localhost development, use query param or environment variable
    if (hostname === 'localhost' || hostname.startsWith('localhost:')) {
      const params = new URLSearchParams(window.location.search);
      return params.get('tenant') || 'tenant1';
    }

    // For production, extract subdomain
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      const subdomain = parts[0];
      return subdomain;
    }

    return 'tenant1';
  }

  private applyTheme(tenant: TenantConfig): void {
    // Set CSS variables for theming
    const root = document.documentElement;
    root.style.setProperty('--primary-color', tenant.primaryColor);
    root.style.setProperty('--secondary-color', tenant.secondaryColor);
    root.style.setProperty('--accent-color', tenant.accentColor);
    root.style.setProperty('--success-color', tenant.successColor);
    root.style.setProperty('--warning-color', tenant.warningColor);
    root.style.setProperty('--error-color', tenant.errorColor);

    // Set favicon
    const faviconElement = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (faviconElement) {
      faviconElement.href = tenant.favicon;
    }

    // Set document title
    document.title = tenant.appName;
  }

  getTenant(): TenantConfig | null {
    return this.currentTenant();
  }

  getAllTenants(): TenantConfig[] {
    return this.tenantsConfig ? Object.values(this.tenantsConfig.tenants) : [];
  }

  switchTenant(tenantId: string): void {
    if (!this.tenantsConfig) {
      console.error('Configuration not loaded');
      return;
    }

    const tenant = this.tenantsConfig.tenants[tenantId];
    if (tenant) {
      this.currentTenant.set(tenant);
      this.applyTheme(tenant);
    } else {
      console.error(`Tenant ${tenantId} not found`);
    }
  }

  getTenantById(tenantId: string): TenantConfig | null {
    return this.tenantsConfig?.tenants[tenantId] || null;
  }
}
