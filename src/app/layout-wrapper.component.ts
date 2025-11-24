import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantService } from './services/tenant.service';
import { SidenavLayoutComponent } from './layouts/sidenav-layout/sidenav-layout.component';
import { TopnavLayoutComponent } from './layouts/topnav-layout/topnav-layout.component';

@Component({
  selector: 'app-layout-wrapper',
  standalone: true,
  imports: [CommonModule, SidenavLayoutComponent, TopnavLayoutComponent],
  template: `
    <!-- Tenant Switcher (visible on localhost or with ?showSwitcher=true) -->
    <div class="tenant-switcher" *ngIf="isDevelopment()">
      <div class="switcher-label">🔄 Switch:</div>
      <button (click)="switchTenant('tenant1')" [class.active]="isTenant('tenant1')" title="Switch to TechCorp (Sidenav Layout)">
        🏢 TechCorp
      </button>
      <button (click)="switchTenant('tenant2')" [class.active]="isTenant('tenant2')" title="Switch to FinanceHub (Topnav Layout)">
        💰 FinanceHub
      </button>
    </div>

    <app-sidenav-layout *ngIf="tenantService.isSidenavLayout()"></app-sidenav-layout>
    <app-topnav-layout *ngIf="tenantService.isTopnavLayout()"></app-topnav-layout>
  `,
  styles: [`
    .tenant-switcher {
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(50, 50, 50, 0.9) 100%);
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .switcher-label {
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-right: 4px;
      white-space: nowrap;
    }

    .tenant-switcher button {
      padding: 6px 12px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 11px;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .tenant-switcher button:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
    }

    .tenant-switcher button.active {
      color: white;
      font-weight: 700;
    }

    .tenant-switcher button.active:nth-child(2) {
      background: #1976d2;
      border-color: #1976d2;
      box-shadow: 0 0 10px rgba(25, 118, 210, 0.5);
    }

    .tenant-switcher button.active:nth-child(3) {
      background: #2e7d32;
      border-color: #2e7d32;
      box-shadow: 0 0 10px rgba(46, 125, 50, 0.5);
    }

    @media (max-width: 600px) {
      .tenant-switcher {
        bottom: 10px;
        left: 10px;
        padding: 8px 12px;
        gap: 6px;
      }

      .switcher-label {
        display: none;
      }

      .tenant-switcher button {
        padding: 5px 10px;
        font-size: 10px;
      }
    }
  `]
})
export class LayoutWrapperComponent implements OnInit {
  constructor(public tenantService: TenantService) {}

  ngOnInit(): void {
    console.log('Current tenant:', this.tenantService.getTenant());
  }

  isDevelopment(): boolean {
    // Show on localhost (always)
    if (window.location.hostname === 'localhost' || 
        window.location.hostname.startsWith('localhost:')) {
      return true;
    }
    
    // Show on Vercel deployments (*.vercel.app)
    if (window.location.hostname.includes('vercel.app')) {
      return true;
    }
    
    // Show if query param is present (for custom domains)
    const params = new URLSearchParams(window.location.search);
    return params.get('showSwitcher') === 'true';
  }

  isTenant(tenantId: string): boolean {
    return this.tenantService.getTenant()?.id === tenantId;
  }

  switchTenant(tenantId: string): void {
    // Get current protocol and host
    const protocol = window.location.protocol;
    const host = window.location.host;
    const pathname = window.location.pathname;
    
    // Redirect to same domain with different tenant query param
    const url = `${protocol}//${host}${pathname}?tenant=${tenantId}&showSwitcher=true`;
    window.location.href = url;
  }
}