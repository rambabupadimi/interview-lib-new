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


    <div class="max-w-7xl mx-auto flex items-center mb-4 mt-4">
        <button mat-icon-button (click)="goBack()" aria-label="Back" class="mr-2">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h2 class="text-2xl font-semibold">Question & Answers</h2>
      </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4 py-4 border mt-4 rounded border-gray-300">

        <div *ngIf="technologies.length > 0">
          <div class="flex flex-wrap gap-3">
            <span
              *ngFor="let tech of technologies"
              class="px-3 py-1 bg-white border border-gray-300 rounded text-sm cursor-pointer"
              (click)="loadQuestions(tech.id)"
               [ngClass]="{'selected-tech': technologyId === tech.id}"
            >
              {{ tech.name }}
            </span>
          </div>
        </div>
    </div>

    <!-- Main Section: Questions/Answers -->
    <div class="flex max-w-7xl mx-auto py-2 gap-6">
      <!-- Left Section: Questions List -->
      <div style="flex-basis:35%; min-width:300px;">
          <div>
            <div class="left-heading-section flex justify-between py-4 items-center ">
            <span><b>Questions</b></span>
            <button mat-stroked-button
              class="custom-stroked-btn !text-black !border-gray-300 hover:bg-gray-300 hover:text-gray-900 hover:border-gray-400 transition-colors"
            (click)="openAddQuestionDialog()">
              <mat-icon>add</mat-icon>
              Add New Question
            </button>
            </div>
            <div class="border rounded border-gray-300 ">
            <div *ngIf="questions.length > 0; else noQuestions">
              <div
                *ngFor="let q of questions"
                class="p-2 cursor-pointer border-b border-gray-300"
                [ngClass]="{'selected': selectedQuestion?.id === q.id}"
                (click)="selectQuestion(q)"
              >
                {{ q.title }}
              </div>
            </div>
            <ng-template #noQuestions>
              <div class="text-gray-500">No questions available.</div>
            </ng-template>
</div>
</div>
      </div>
      <!-- Right Section: Answers -->
      <div style="flex-basis:65%;" class="border rounded border-gray-300 mt-4 px-6 py-2">
        <div>
          <div class="flex items-center justify-between  items-center mb-4 mt-4">
            <span><b>Answers</b></span>
            <button
            mat-stroked-button
              class="custom-stroked-btn !text-black !border-gray-300 hover:bg-gray-300 hover:text-gray-900 hover:border-gray-400 transition-colors"

            (click)="addAnswer()" >
              <mat-icon>add</mat-icon>
              Add New Answer
            </button>
          </div>
            <div *ngIf="selectedQuestion">
              <div *ngIf="answers.length > 0; else noAnswers">
                <div *ngFor="let ans of answers" class="mb-4 p-2 border rounded bg-white border-gray-300 ">
                  <!-- <div>{{ ans.answer_text }}</div> -->

                  <div class="NgxEditor__Wrapper" style="background: white;border-radius: 6px;border: none;">
                <div [innerHTML]="ans.answer_text"
                class="editor-container" aria-placeholder="Enter question here.."></div>
              </div>
                  <div class="text-xs text-gray-400 mt-1" style="display:flex;justify-content:end">By: {{ ans.created_by_name }} | {{ ans.created_at | date:'medium' }}</div>
                </div>
              </div>
              <ng-template #noAnswers>
                <div class="text-gray-500">No answers available for this question.</div>
              </ng-template>
            </div>
            <div *ngIf="!selectedQuestion" class="text-gray-400">Select a question to view answers.</div>

      </div>
    </div>
    </div>
  `,
  styles: [`
    .selected {
      background: #e0e7ff;
      border-color: #6366f1;
    }
    .selected-tech {
    background: #000;
    color: #fff;
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
  goBack() {
    this.router.navigate(['/admin']);
  }
}