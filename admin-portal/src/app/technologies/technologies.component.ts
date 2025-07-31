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
      <mat-card>
        <mat-card-title class="flex justify-between items-center">
          <span>Technologies</span>
          <button mat-raised-button color="primary" (click)="addTechnology()">Add Technology</button>
        </mat-card-title>
        <mat-card-content>
          <table mat-table [dataSource]="technologies" class="min-w-full">
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
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [``]
})
export class TechnologiesComponent implements OnInit {
  technologies: any[] = [];
  displayedColumns = ['name', 'description', 'actions'];
  constructor(private http: HttpClient, private router: Router) {}
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
}