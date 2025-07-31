import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  status: string;
  role_id: number;
  created_at: string;
}

interface DashboardStats {
  totalUsers: number;
  totalTechnologies: number;
  totalQuestions: number;
  totalAnswers: number;
  activeUsers: number;
  pendingApprovals: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: AdminUser | null = null;
  stats: DashboardStats = {
    totalUsers: 0,
    totalTechnologies: 0,
    totalQuestions: 0,
    totalAnswers: 0,
    activeUsers: 0,
    pendingApprovals: 0
  };
  isLoading = false;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('admin_user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    }

    // const accessToken = localStorage.getItem('admin_accessToken');
    // if (!accessToken) {
    //   this.router.navigate(['/admin/login']);
    //   return;
    // }

   // this.loadDashboardStats();
  }

  async loadDashboardStats(): Promise<void> {
    this.isLoading = true;
    try {
      // Load statistics from backend
      const statsResponse = await this.http.get<DashboardStats>('/api/admin/stats').toPromise();
      if (statsResponse) {
        this.stats = statsResponse;
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      // Set default stats for demo
      this.stats = {
        totalUsers: 1250,
        totalTechnologies: 45,
        totalQuestions: 3200,
        totalAnswers: 8900,
        activeUsers: 850,
        pendingApprovals: 12
      };
    } finally {
      this.isLoading = false;
    }
  }

  logout(): void {
    localStorage.removeItem('admin_accessToken');
    localStorage.removeItem('admin_refreshToken');
    localStorage.removeItem('admin_user');
    this.router.navigate(['/admin/login']);
  }

  navigateToSection(section: string): void {
    // Navigate to different admin sections
    switch (section) {
      case 'users':
        this.router.navigate(['/admin/users']);
        break;
      case 'technologies':
        this.router.navigate(['/admin/technologies']);
        break;
      case 'questions':
        this.router.navigate(['/admin/questions']);
        break;
      case 'reports':
        this.router.navigate(['/admin/reports']);
        break;
      default:
        break;
    }
  }

  navigateToUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'accent';
      case 'inactive':
        return 'warn';
      default:
        return 'primary';
    }
  }
}
