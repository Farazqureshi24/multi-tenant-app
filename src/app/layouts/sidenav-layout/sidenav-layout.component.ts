import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TenantService } from '../../services/tenant.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-sidenav-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './sidenav-layout.component.html',
  styleUrl: './sidenav-layout.component.scss'
})
export class SidenavLayoutComponent implements OnInit {
  sidenavOpened = signal(true);
  isDarkMode = signal(false);

  navigationItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'people', label: 'Users', route: '/users' },
    { icon: 'settings', label: 'Settings', route: '/settings' },
    { icon: 'help', label: 'Help', route: '/help' }
  ];

  constructor(
    public tenantService: TenantService,
    public themeService: ThemeService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isDarkMode.set(this.themeService.isDarkMode$());
  }

  toggleSidenav(): void {
    this.sidenavOpened.update(value => !value);
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
    this.isDarkMode.set(this.themeService.isDarkMode$());
  }

  logout(): void {
    this.authService.logout();
  }
}
