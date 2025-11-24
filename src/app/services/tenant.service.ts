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
        console.log(`Loaded tenant: ${tenantId} (${tenant.name})`);
        this.currentTenant.set(tenant);
        this.applyTheme(tenant);
      } else {
        console.warn(`Tenant "${tenantId}" not found. Using default tenant.`);
        const defaultTenantId = this.tenantsConfig.defaultTenant;
        const defaultTenant = this.tenantsConfig.tenants[defaultTenantId];
        
        if (defaultTenant) {
          console.log(`Loaded default tenant: ${defaultTenantId} (${defaultTenant.name})`);
          this.currentTenant.set(defaultTenant);
          this.applyTheme(defaultTenant);
        } else {
          throw new Error(`Default tenant "${defaultTenantId}" not found in configuration`);
        }
      }
      
      this.configLoaded.set(true);
    } catch (error) {
      console.error('Failed to load tenant configuration:', error);
      // Set a minimal default to prevent complete app failure
      const fallbackTenant: TenantConfig = {
        id: 'fallback',
        name: 'Default Tenant',
        domain: 'localhost',
        subdomain: 'localhost',
        logo: 'assets/logos/techcorp-logo.svg',
        favicon: 'assets/favicons/techcorp-favicon.ico',
        layout: 'sidenav',
        primaryColor: '#1976d2',
        secondaryColor: '#ff4081',
        accentColor: '#00bcd4',
        successColor: '#4caf50',
        warningColor: '#ff9800',
        errorColor: '#f44336',
        appName: 'Dashboard',
        description: 'Multi-Tenant Application'
      };
      this.currentTenant.set(fallbackTenant);
      this.applyTheme(fallbackTenant);
      this.configLoaded.set(true);
    }
  }

  private getCurrentTenantId(): string {
    const hostname = window.location.hostname;
    
    // First, check query param (highest priority for flexibility)
    const params = new URLSearchParams(window.location.search);
    const queryTenant = params.get('tenant');
    if (queryTenant) {
      return queryTenant;
    }

    // For localhost development, use environment or default
    if (hostname === 'localhost' || hostname.startsWith('localhost:')) {
      return 'tenant1';
    }

    // For production, extract subdomain
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      const subdomain = parts[0];
      
      // Check if extracted subdomain exists in config
      if (this.tenantsConfig && this.tenantsConfig.tenants[subdomain]) {
        return subdomain;
      }
      
      // For Vercel or other deployments with auto-generated subdomains,
      // check if subdomain matches any configured tenant's domain pattern
      if (this.tenantsConfig) {
        for (const [tenantId, tenantConfig] of Object.entries(this.tenantsConfig.tenants)) {
          if (tenantConfig.subdomain === subdomain) {
            return tenantId;
          }
        }
      }
    }

    // Fallback to default tenant
    return this.tenantsConfig?.defaultTenant || 'tenant1';
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
