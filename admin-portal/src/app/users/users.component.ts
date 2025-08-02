import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="max-w-5xl mx-auto py-8">
      <div class="flex items-center mb-4">
        <button mat-icon-button (click)="goBack()" aria-label="Back" class="mr-2">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h2 class="text-2xl font-semibold">Users</h2>
      </div>
      <table mat-table [dataSource]="users" class="min-w-full custom-table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let u">{{ u.name }}</td>
        </ng-container>
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let u">{{ u.email }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let u">{{ u.status }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let u">
            <button mat-button color="accent" (click)="editUser(u.id)">Edit</button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .custom-table {
      border: 1px solid #d1d5db; /* Tailwind gray-300 */
      border-radius: 8px;
      overflow: visible;
      background-color: #fff; /* Tailwind white */
    }
    ::ng-deep .custom-table tr {
      border-bottom: 1px solid #d1d5db !important;
    }
    ::ng-deep .mat-cell {
   border-bottom: 1px solid #d1d5db; /* Change this color */
}
    ::ng-deep .custom-table tr:last-child {
      border-bottom: none;
    }
  `]
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  displayedColumns = ['name', 'email', 'status', 'actions'];
  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit() {
    this.loadUsers();
  }
  loadUsers() {
    this.http.get<any[]>(`${environment.apiUrl}/users/list`).subscribe(data => this.users = data);
  }
  editUser(id: string) {
    this.router.navigate(['/admin/users/edit', id]);
  }
  toggleBlock(user: any) {
    const action = user.status === 'blocked' ? 'unblock' : 'block';
    this.http.patch(`${environment.apiUrl}/users/${user.id}/${action}`, {}).subscribe(() => this.loadUsers());
  }
  goBack() {
    this.router.navigate(['/admin']);
  }
}