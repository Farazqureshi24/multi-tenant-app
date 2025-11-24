import { Injectable, signal, computed } from '@angular/core';
import { TenantService, TenantConfig } from './tenant.service';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  background?: string;
  text?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = signal(false);
  private customColors = signal<Partial<ThemeColors> | null>(null);

  isDarkMode$ = this.isDarkMode.asReadonly();
  customColors$ = this.customColors.asReadonly();

  themeColors = computed(() => {
    const tenant = this.tenantService.getTenant();
    if (!tenant) return null;

    const baseColors: ThemeColors = {
      primary: tenant.primaryColor,
      secondary: tenant.secondaryColor,
      accent: tenant.accentColor,
      success: tenant.successColor,
      warning: tenant.warningColor,
      error: tenant.errorColor,
      background: this.isDarkMode() ? '#121212' : '#ffffff',
      text: this.isDarkMode() ? '#ffffff' : '#212121'
    };

    return this.customColors() 
      ? { ...baseColors, ...this.customColors() } 
      : baseColors;
  });

  constructor(private tenantService: TenantService) {
    this.initializeDarkMode();
  }

  private initializeDarkMode(): void {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode !== null) {
      this.isDarkMode.set(savedMode === 'true');
    } else {
      this.isDarkMode.set(prefersDark);
    }
  }

  toggleDarkMode(): void {
    const newMode = !this.isDarkMode();
    this.isDarkMode.set(newMode);
    localStorage.setItem('darkMode', String(newMode));
    this.applyThemeMode();
  }

  setDarkMode(isDark: boolean): void {
    this.isDarkMode.set(isDark);
    localStorage.setItem('darkMode', String(isDark));
    this.applyThemeMode();
  }

  private applyThemeMode(): void {
    const root = document.documentElement;
    if (this.isDarkMode()) {
      root.style.setProperty('--bg-color', '#121212');
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--card-bg-color', '#1e1e1e');
      root.classList.add('dark-theme');
    } else {
      root.style.setProperty('--bg-color', '#ffffff');
      root.style.setProperty('--text-color', '#212121');
      root.style.setProperty('--card-bg-color', '#f5f5f5');
      root.classList.remove('dark-theme');
    }
  }

  setCustomColors(colors: Partial<ThemeColors>): void {
    this.customColors.set(colors);
  }

  resetToTenantTheme(): void {
    this.customColors.set(null);
  }

  getColorByStatus(status: 'success' | 'warning' | 'error' | 'info'): string {
    const colors = this.themeColors();
    if (!colors) return '#757575';

    switch (status) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
      default:
        return colors.accent;
    }
  }
}
