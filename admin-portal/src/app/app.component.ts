import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { TopbarComponent } from './topbar.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [ RouterModule, TopbarComponent, CommonModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'admin-portal';
  constructor(private router: Router) {}
  isLoginRoute(): boolean {
    return this.router.url.includes('/admin/login');
  }
}
