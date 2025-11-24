import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="unauthorized-container">
      <mat-card class="error-card">
        <div class="error-icon">
          <mat-icon>lock</mat-icon>
        </div>
        
        <h1>Access Denied</h1>
        <p class="error-message">
          You do not have permission to access this resource.
        </p>
        
        <div class="error-details">
          <p>Your current role does not grant access to this page.</p>
          <p>Please contact your administrator if you believe this is a mistake.</p>
        </div>

        <button mat-raised-button color="primary" routerLink="/dashboard">
          <mat-icon>arrow_back</mat-icon>
          Go to Dashboard
        </button>
      </mat-card>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
    }

    .error-card {
      max-width: 500px;
      text-align: center;
      padding: 40px;
      border-radius: 12px;
    }

    .error-icon {
      font-size: 80px;
      color: var(--error-color);
      margin-bottom: 20px;

      mat-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
      }
    }

    h1 {
      font-size: 32px;
      font-weight: 700;
      color: var(--text-color);
      margin: 20px 0 10px 0;
    }

    .error-message {
      font-size: 18px;
      color: var(--error-color);
      margin: 0 0 20px 0;
      font-weight: 500;
    }

    .error-details {
      background-color: rgba(0, 0, 0, 0.05);
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;

      p {
        margin: 8px 0;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.7);
      }
    }

    button {
      margin-top: 20px;
      padding: 10px 24px;
      font-size: 16px;
    }

    :host-context(.dark-theme) {
      .error-details {
        background-color: rgba(255, 255, 255, 0.05);

        p {
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
  `]
})
export class UnauthorizedComponent {}
