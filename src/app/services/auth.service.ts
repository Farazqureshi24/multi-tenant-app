import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { User, LoginRequest, LoginResponse } from '../models/auth.model';
import { TenantService } from './tenant.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY_USER = 'auth_user';
  private readonly STORAGE_KEY_TOKEN = 'auth_token';
  private readonly STORAGE_KEY_ROLE = 'auth_role';

  private currentUser = signal<User | null>(null);
  private currentToken = signal<string | null>(null);
  private isAuthenticated = signal(false);
  private loading = signal(false);
  private error = signal<string | null>(null);

  // Mock users database - in production, this would be from a backend
  private mockUsers: { [key: string]: User } = {
    'admin@techcorp.com': {
      id: 'admin1',
      email: 'admin@techcorp.com',
      username: 'admin_tech',
      fullName: 'Admin TechCorp',
      role: 'admin',
      tenantId: 'tenant1',
      isActive: true,
      createdAt: new Date('2024-01-01')
    },
    'user@techcorp.com': {
      id: 'user1',
      email: 'user@techcorp.com',
      username: 'user_tech',
      fullName: 'John Smith',
      role: 'user',
      tenantId: 'tenant1',
      isActive: true,
      createdAt: new Date('2024-02-01')
    },
    'admin@financehub.com': {
      id: 'admin2',
      email: 'admin@financehub.com',
      username: 'admin_finance',
      fullName: 'Admin FinanceHub',
      role: 'admin',
      tenantId: 'tenant2',
      isActive: true,
      createdAt: new Date('2024-01-15')
    },
    'user@financehub.com': {
      id: 'user2',
      email: 'user@financehub.com',
      username: 'user_finance',
      fullName: 'Jane Doe',
      role: 'user',
      tenantId: 'tenant2',
      isActive: true,
      createdAt: new Date('2024-02-15')
    }
  };

  currentUser$ = this.currentUser.asReadonly();
  isAuthenticated$ = this.isAuthenticated.asReadonly();
  loading$ = this.loading.asReadonly();
  error$ = this.error.asReadonly();
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  isUser = computed(() => this.currentUser()?.role === 'user');

  constructor(
    private http: HttpClient,
    private router: Router,
    private tenantService: TenantService
  ) {
    this.restoreSession();
  }

  private restoreSession(): void {
    try {
      const storedUser = localStorage.getItem(this.STORAGE_KEY_USER);
      const storedToken = localStorage.getItem(this.STORAGE_KEY_TOKEN);

      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser);
        this.currentUser.set(user);
        this.currentToken.set(storedToken);
        this.isAuthenticated.set(true);
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      this.clearStorage();
    }
  }

  async login(credentials: LoginRequest): Promise<boolean> {
    this.loading.set(true);
    this.error.set(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const user = this.mockUsers[credentials.email];

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Validate password - all test users have password "password"
      if (credentials.password !== 'password') {
        throw new Error('Invalid email or password');
      }

      // Check if user belongs to current tenant
      const currentTenant = this.tenantService.getTenant();
      if (currentTenant && user.tenantId !== currentTenant.id) {
        throw new Error('User does not belong to this tenant');
      }

      // Simulate token generation
      const token = this.generateMockToken(user);

      // Save to storage
      this.saveSession(user, token);

      this.currentUser.set(user);
      this.currentToken.set(token);
      this.isAuthenticated.set(true);

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      this.error.set(errorMessage);
      console.error('Login error:', err);
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  logout(): void {
    this.clearStorage();
    this.currentUser.set(null);
    this.currentToken.set(null);
    this.isAuthenticated.set(false);
    this.error.set(null);
    this.router.navigate(['/login']);
  }

  private saveSession(user: User, token: string): void {
    localStorage.setItem(this.STORAGE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(this.STORAGE_KEY_TOKEN, token);
    localStorage.setItem(this.STORAGE_KEY_ROLE, user.role);
  }

  private clearStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY_USER);
    localStorage.removeItem(this.STORAGE_KEY_TOKEN);
    localStorage.removeItem(this.STORAGE_KEY_ROLE);
  }

  private generateMockToken(user: User): string {
    // Simple mock token - in production, use JWT
    return btoa(JSON.stringify({ userId: user.id, email: user.email, timestamp: Date.now() }));
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getToken(): string | null {
    return this.currentToken();
  }

  hasRole(role: 'admin' | 'user'): boolean {
    return this.currentUser()?.role === role;
  }

  canAccess(requiredRole?: 'admin' | 'user'): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }
    if (!requiredRole) {
      return true;
    }
    return this.hasRole(requiredRole);
  }

  // For development: Get all available test credentials
  getTestCredentials() {
    return [
      { email: 'admin@techcorp.com', password: 'password', role: 'admin', tenant: 'TechCorp' },
      { email: 'user@techcorp.com', password: 'password', role: 'user', tenant: 'TechCorp' },
      { email: 'admin@financehub.com', password: 'password', role: 'admin', tenant: 'FinanceHub' },
      { email: 'user@financehub.com', password: 'password', role: 'user', tenant: 'FinanceHub' }
    ];
  }
}
