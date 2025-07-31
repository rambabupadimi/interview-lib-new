import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { environment } from 'admin-portal/src/environments/environment';
import { CommonModule } from '@angular/common';
import { AddQuestionComponent } from '../add-question/add-question.component'; // Adjust path as needed
import { AddAnswerComponent } from '../add-answer/add-answer.component';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule,
    MatDialogModule, // <-- Add this
  ],
  template: `
    <!-- Top Section: Technology List -->
    <div class="max-w-5xl mx-auto mt-8 mb-4">
      <mat-card style="height:100px; overflow-y:auto;">
        <mat-card-title>Technologies</mat-card-title>
        <mat-card-content *ngIf="technologies.length > 0">
          <div class="flex flex-wrap gap-3">
            <span
              *ngFor="let tech of technologies"
              class="px-3 py-1 bg-gray-200 rounded text-sm cursor-pointer"
              (click)="loadQuestions(tech.id)"
            >
              {{ tech.name }}
            </span>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
    <br/>
    <!-- Main Section: Questions/Answers -->
    <div class="flex max-w-5xl mx-auto py-8 gap-6">
      <!-- Left Section: Questions List -->
      <div style="flex-basis:35%; min-width:300px;">
        <mat-card>
          <mat-card-title class="flex items-center justify-between">
            <span>Questions</span>
            <button mat-raised-button color="primary" (click)="openAddQuestionDialog()">
              <mat-icon>add</mat-icon>
              Create
            </button>
          </mat-card-title>
          <mat-card-content>
            <div *ngIf="questions.length > 0; else noQuestions">
              <div
                *ngFor="let q of questions"
                class="p-2 border rounded mb-2 cursor-pointer"
                [ngClass]="{'selected': selectedQuestion?.id === q.id}"
                (click)="selectQuestion(q)"
              >
                {{ q.title }}
              </div>
            </div>
            <ng-template #noQuestions>
              <div class="text-gray-500">No questions available.</div>
            </ng-template>
          </mat-card-content>
        </mat-card>
      </div>
      <!-- Right Section: Answers -->
      <div style="flex-basis:65%;">
        <mat-card>
          <mat-card-title class="flex items-center justify-between">
            <span>Answers</span>
            <button mat-raised-button color="primary" (click)="addAnswer()" >
              <mat-icon>add</mat-icon>
              Create
            </button>
          </mat-card-title>
          <mat-card-content>
            <div *ngIf="selectedQuestion">
              <div *ngIf="answers.length > 0; else noAnswers">
                <div *ngFor="let ans of answers" class="mb-4 p-2 border rounded bg-gray-50">
                  <!-- <div>{{ ans.answer_text }}</div> -->

                  <div class="NgxEditor__Wrapper" style="background: white;border-radius: 6px;border: none;">
                <div [innerHTML]="ans.answer_text"
                class="editor-container" aria-placeholder="Enter question here.."></div>
              </div>
                  <div class="text-xs text-gray-400 mt-1">By: {{ ans.created_by_name }} | {{ ans.created_at | date:'medium' }}</div>
                </div>
              </div>
              <ng-template #noAnswers>
                <div class="text-gray-500">No answers available for this question.</div>
              </ng-template>
            </div>
            <div *ngIf="!selectedQuestion" class="text-gray-400">Select a question to view answers.</div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .selected {
      background: #e0e7ff;
      border-color: #6366f1;
    }
  `]
})
export class QuestionsComponent implements OnInit {
  questions: any[] = [];
  answers: any[] = [];
  selectedQuestion: any = null;
  technologies: any[] = [];
  technologyId = -1;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog // <-- Add this
  ) { }

  ngOnInit() {
    this.loadTechnologies();
  }

  loadQuestions(id: number) {
    this.technologyId = id;
    this.http.get<any[]>(`${environment.apiUrl}/questions/all-with-answers/technology/${id}`).subscribe((data: any) => {
      this.questions = data;
      console.log(this.questions);
    });
  }

  loadTechnologies() {

    this.http.get<string[]>(`${environment.apiUrl}/technologies`).subscribe((data: any) => {
      this.technologies = data.data;
      this.loadQuestions(this.technologies[0]?.id || -1); // Load questions for the first technology by default
      console.log(this.technologies);
    });
  }

  selectQuestion(q: any) {
    this.selectedQuestion = q;
    this.answers = q.answers || [];
  }

  editQuestion(id: string) {
    this.router.navigate(['/admin/questions/edit', id]);
  }

  deleteQuestion(id: string) {
    // if (confirm('Are you sure you want to delete this question?')) {
    //   this.http.delete(`/api/admin/questions/${id}`).subscribe(() => this.loadQuestions());
    // }
  }

  openAddQuestionDialog() {
    const dialogRef = this.dialog.open(AddQuestionComponent, {
      width: '600px',
      data: {
        id: this.technologyId
      } // Pass any data if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.loadQuestions(this.technologyId);
        // Reload questions if needed
        // Optionally, reload the current technology's questions
        // this.loadQuestions(currentTechId);
      }
    });
  }

  addAnswer() {
    const dialogRef = this.dialog.open(AddAnswerComponent, {
      width: '600px',
      data: {
        id: this.technologyId,
        questionId: this.selectedQuestion?.id
      } // Pass any data if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.loadQuestions(this.technologyId);
        // Reload questions if needed
        // Optionally, reload the current technology's questions
        // this.loadQuestions(currentTechId);
      }
    });
  }
}