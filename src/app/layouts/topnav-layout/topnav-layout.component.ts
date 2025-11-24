import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TenantService } from '../../services/tenant.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-topnav-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatTabsModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './topnav-layout.component.html',
  styleUrl: './topnav-layout.component.scss'
})
export class TopnavLayoutComponent implements OnInit {
  isDarkMode = signal(false);

  navigationItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Accounts', route: '/accounts', icon: 'account_balance' },
    { label: 'Transactions', route: '/transactions', icon: 'receipt' },
    { label: 'Reports', route: '/reports', icon: 'assessment' },
    { label: 'Settings', route: '/settings', icon: 'settings' }
  ];

  constructor(
    public tenantService: TenantService,
    public themeService: ThemeService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isDarkMode.set(this.themeService.isDarkMode$());
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
    this.isDarkMode.set(this.themeService.isDarkMode$());
  }

  logout(): void {
    this.authService.logout();
  }
}
