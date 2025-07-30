import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <nav class="bg-white shadow-sm border-b w-full z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-2">
            <mat-icon class="text-indigo-600">admin_panel_settings</mat-icon>
            <span class="text-xl font-bold text-gray-900">Admin Portal</span>
          </div>
          <div class="flex items-center space-x-6">
            <a routerLink="/admin/dashboard" routerLinkActive="font-semibold text-indigo-600" class="hover:text-indigo-600 transition">Dashboard</a>
            <a routerLink="/admin/technologies" routerLinkActive="font-semibold text-indigo-600" class="hover:text-indigo-600 transition">Technologies</a>
            <a routerLink="/admin/questions" routerLinkActive="font-semibold text-indigo-600" class="hover:text-indigo-600 transition">Q&A</a>
            <a routerLink="/admin/users" routerLinkActive="font-semibold text-indigo-600" class="hover:text-indigo-600 transition">Users</a>
            <a routerLink="/admin/reports" routerLinkActive="font-semibold text-indigo-600" class="hover:text-indigo-600 transition">Reports</a>
            <button mat-stroked-button color="warn" (click)="logout()" class="ml-4">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [``]
})
export class TopbarComponent {
  constructor(private router: Router) {}
  logout() {
    localStorage.removeItem('admin_accessToken');
    localStorage.removeItem('admin_refreshToken');
    localStorage.removeItem('admin_user');
    this.router.navigate(['/admin/login']);
  }
} 