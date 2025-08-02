import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule,CommonModule],
  template: `
    <nav class="bg-white shadow-sm border-b border-gray-300 w-full z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-2">
            <mat-icon class="text-indigo-600">admin_panel_settings</mat-icon>
            <span class="text-xl font-bold text-gray-900">Admin Portal</span>
          </div>
          <div class="flex items-center space-x-6">
            <span *ngIf="username" class="text-gray-700 font-medium mr-2">Hello, {{ username }}</span>
            <button
              mat-stroked-button
              color="warn"
              (click)="logout()"
              class="ml-4 !text-black !border-gray-300 hover:bg-gray-300 hover:text-gray-900 hover:border-gray-400 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [``]
})
export class TopbarComponent {
  username: string | null = null;
  constructor(private router: Router) {
    const user = localStorage.getItem('admin_user');
    if (user) {
      try {
        this.username = JSON.parse(user).name || null;
      } catch {
        this.username = null;
      }
      console.log(this.username);
    }
  }
  logout() {
    localStorage.removeItem('admin_accessToken');
    localStorage.removeItem('admin_refreshToken');
    localStorage.removeItem('admin_user');
    this.router.navigate(['/admin/login']);
  }
}