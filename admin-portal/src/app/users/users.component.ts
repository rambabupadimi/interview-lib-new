import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="max-w-5xl mx-auto py-8">
      <mat-card>
        <mat-card-title class="flex justify-between items-center">
          <span>Users</span>
        </mat-card-title>
        <mat-card-content>
          <table mat-table [dataSource]="users" class="min-w-full">
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
                <button mat-button color="warn" (click)="toggleBlock(u)">{{ u.status === 'blocked' ? 'Unblock' : 'Block' }}</button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [``]
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  displayedColumns = ['name', 'email', 'status', 'actions'];
  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit() {
    this.loadUsers();
  }
  loadUsers() {
    this.http.get<any[]>('/api/admin/users').subscribe(data => this.users = data);
  }
  editUser(id: string) {
    this.router.navigate(['/admin/users/edit', id]);
  }
  toggleBlock(user: any) {
    const action = user.status === 'blocked' ? 'unblock' : 'block';
    this.http.patch(`/api/admin/users/${user.id}/${action}`, {}).subscribe(() => this.loadUsers());
  }
} 