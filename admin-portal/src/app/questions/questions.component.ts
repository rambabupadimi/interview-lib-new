import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="max-w-5xl mx-auto py-8">
      <mat-card>
        <mat-card-title class="flex justify-between items-center">
          <span>Questions</span>
        </mat-card-title>
        <mat-card-content>
          <table mat-table [dataSource]="questions" class="min-w-full">
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let q">{{ q.title }}</td>
            </ng-container>
            <ng-container matColumnDef="author">
              <th mat-header-cell *matHeaderCellDef>Author</th>
              <td mat-cell *matCellDef="let q">{{ q.author }}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let q">
                <button mat-button color="accent" (click)="editQuestion(q.id)">Edit</button>
                <button mat-button color="warn" (click)="deleteQuestion(q.id)">Delete</button>
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
export class QuestionsComponent implements OnInit {
  questions: any[] = [];
  displayedColumns = ['title', 'author', 'actions'];
  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit() {
    this.loadQuestions();
  }
  loadQuestions() {
    this.http.get<any[]>('/api/admin/questions').subscribe(data => this.questions = data);
  }
  editQuestion(id: string) {
    this.router.navigate(['/admin/questions/edit', id]);
  }
  deleteQuestion(id: string) {
    if (confirm('Are you sure you want to delete this question?')) {
      this.http.delete(`/api/admin/questions/${id}`).subscribe(() => this.loadQuestions());
    }
  }
} 