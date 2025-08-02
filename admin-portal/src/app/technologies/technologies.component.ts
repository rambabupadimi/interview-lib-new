import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../environments/environment'; // Import environment

@Component({
  selector: 'app-technologies',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="max-w-5xl mx-auto py-8">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center">
          <button mat-icon-button (click)="navigateToAdmin()" aria-label="Back" class="mr-2">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h2 class="text-2xl font-semibold">Technologies</h2>
        </div>
        <button mat-stroked-button class=" !text-black !border-gray-300 hover:bg-gray-300 hover:text-gray-900 hover:border-gray-400 transition-colors" (click)="addTechnology()">
          <mat-icon>add</mat-icon>
          Create
        </button>
      </div>
      <table mat-table [dataSource]="technologies" class="min-w-full bg-white rounded border border-gray-300 custom-table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let tech">{{ tech.name }}</td>
        </ng-container>
        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef>Description</th>
          <td mat-cell *matCellDef="let tech">{{ tech.description }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let tech">
            <button mat-button color="accent" (click)="editTechnology(tech.id)">Edit</button>
            <button mat-button color="warn" (click)="deleteTechnology(tech.id)">Delete</button>
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
    }`]
})
export class TechnologiesComponent implements OnInit {
  technologies: any[] = [];
  displayedColumns = ['name', 'description', 'actions'];
  constructor(private http: HttpClient, private router: Router) { }
  ngOnInit() {
    this.loadTechnologies();
  }
  loadTechnologies() {
    this.http.get<any[]>(`${environment.apiUrl}/technologies`).subscribe((result: any) => this.technologies = result.data);
  }
  addTechnology() {
    this.router.navigate(['/admin/technologies/add']);
  }
  editTechnology(id: string) {
    this.router.navigate(['/admin/technologies/edit', id]);
  }
  deleteTechnology(id: string) {
    if (confirm('Are you sure you want to delete this technology?')) {
      this.http.delete(`${environment.apiUrl}/technologies/${id}`).subscribe(() => this.loadTechnologies());
    }
  }
  navigateToAdmin() {
    this.router.navigate(['/admin']);
  }
}