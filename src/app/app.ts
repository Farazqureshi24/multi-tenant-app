import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TenantService } from './services/tenant.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  constructor(public tenantService: TenantService) {}

  ngOnInit(): void {
    console.log('App initialized with tenant:', this.tenantService.getTenant());
  }
}
