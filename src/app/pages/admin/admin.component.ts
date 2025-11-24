import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TenantService } from '../../services/tenant.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatTabsModule,
    MatListModule,
    RouterLink,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = ['id', 'email', 'name', 'role', 'status'];
  usersData = [
    {
      id: '001',
      email: 'admin@techcorp.com',
      name: 'Alice Admin',
      role: 'Admin',
      status: 'Active',
    },
    {
      id: '002',
      email: 'user@techcorp.com',
      name: 'Bob User',
      role: 'User',
      status: 'Active',
    },
    {
      id: '003',
      email: 'admin@financehub.com',
      name: 'Charlie Admin',
      role: 'Admin',
      status: 'Active',
    },
  ];

  logsData = [
    {
      timestamp: '2024-01-15 14:32:10',
      action: 'User login',
      user: 'admin@techcorp.com',
      status: 'Success',
    },
    {
      timestamp: '2024-01-15 14:25:45',
      action: 'Configuration updated',
      user: 'admin@techcorp.com',
      status: 'Success',
    },
    {
      timestamp: '2024-01-15 14:18:22',
      action: 'Failed login attempt',
      user: 'unknown@email.com',
      status: 'Failed',
    },
    {
      timestamp: '2024-01-15 14:12:05',
      action: 'User deleted',
      user: 'admin@financehub.com',
      status: 'Success',
    },
  ];

  constructor(
    public authService: AuthService,
    public tenantService: TenantService
  ) {}

  ngOnInit() {
    // In a real application, you would load data from your backend
    console.log('Admin panel initialized');
  }

  deleteUser(userId: string) {
    alert(`Delete user ${userId} - implement in backend`);
  }

  resetPassword(userId: string) {
    alert(`Reset password for user ${userId} - implement in backend`);
  }

  exportLogs() {
    alert('Export logs - implement in backend');
  }

  clearCache() {
    alert('Cache cleared');
  }
}
