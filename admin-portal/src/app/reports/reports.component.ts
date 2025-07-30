import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [MatTableModule, MatCardModule, CommonModule],
  template: `
    <div class="max-w-5xl mx-auto py-8">
      <mat-card>
        <mat-card-title>Reports</mat-card-title>
        <mat-card-content>
          <table mat-table [dataSource]="reports" class="min-w-full">
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let r">{{ r.type }}</td>
            </ng-container>
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let r">{{ r.description }}</td>
            </ng-container>
            <ng-container matColumnDef="created">
              <th mat-header-cell *matHeaderCellDef>Created</th>
              <td mat-cell *matCellDef="let r">{{ r.created_at | date:'short' }}</td>
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
export class ReportsComponent implements OnInit {
  reports: any[] = [];
  displayedColumns = ['type', 'description', 'created'];
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.http.get<any[]>('/api/admin/reports').subscribe(data => this.reports = data);
  }
}