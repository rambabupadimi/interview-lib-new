import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { EditAnswerComponent } from '../edit-answer/edit-answer.component';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import hljs from 'highlight.js'; // Import Highlight.js
hljs.configure({
  languages: ['javascript', 'python', 'java', 'html', 'css'] // Add desired languages
});

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
            <div class="border rounded border-gray-300 " style="    height: calc(100vh - 330px);
    overflow: scroll;">
            <div *ngIf="questions.length > 0; else noQuestions">
              <div
                *ngFor="let q of questions"
                class="p-2 cursor-pointer border-b border-gray-300 text-sm"
                [ngClass]="{'selected': selectedQuestion?.id === q.id}"
                (click)="selectQuestion(q)"
                [innerHTML] ="q.title"
              >
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
              <div *ngIf="answers.length > 0; else noAnswers"  style="height: calc(100vh - 400px);overflow: scroll;">
                <div *ngFor="let ans of answers" class="mb-4 p-2 border rounded bg-white border-gray-300 ">
                  <!-- <div>{{ ans.answer_text }}</div> -->

                  <div class="NgxEditor__Wrapper" style="background: white;border-radius: 6px;border: none;font-size:14px;padding:12px;">
                <div [innerHTML]="ans.answer_text"  #answerEditorContainer
                class="editor-container" aria-placeholder="Enter question here.."></div>
              </div>
                  <div class="text-xs text-gray-400 mt-1" style="display:flex;justify-content:space-between">
                  <div>
                    <span (click)="editAnswer(ans.id,ans.answer_text)" class="cursor-pointer px-2"><u>Edit</u></span>
                </div>
                  <div>
                  By: {{ ans.created_by_name }} | {{ ans.created_at | date:'medium' }}
                </div>
                </div>
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
      background: #e3e0e0;
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

  @ViewChild("answerEditorContainer")
  answerEditorContainer?: ElementRef;
  answerEditor: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog // <-- Add this
  ) { }

  ngOnInit() {
    this.loadTechnologies();
  }

  initAnswerEditor(){
    if (this.answerEditorContainer) {
      try {
          this.answerEditor = new Quill(this.answerEditorContainer.nativeElement, {
            modules: {
              toolbar: [
                // Text formatting
                [{ 'font': [] }], // Font selection
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // Headers (h1-h6)
                ['bold', 'italic', 'underline', 'strike'], // Bold, Italic, Underline, Strike-through

                // Subscript/Superscript
                [{ 'script': 'sub' }, { 'script': 'super' }], // Subscript / Superscript

                // Lists
                [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Ordered & Unordered list

                // Indentation
                [{ 'indent': '-1' }, { 'indent': '+1' }], // Outdent and Indent

                // Alignment
                [{ 'align': [] }], // Alignment options

                // Line height and blockquotes
                [{ 'lineheight': [] }], // Line height adjustment
                ['blockquote', 'code-block'], // Blockquote and Code block

                // Links, images, and videos
                ['link', 'image', 'video'], // Hyperlink, Image, Video embedding

                // Text color & background
                [{ 'color': [] }, { 'background': [] }], // Text color and background color

                // Clear formatting
                ['clean'], // Remove formatting button
              ],
              syntax: {
                highlight: (text:any) => hljs.highlightAuto(text).value // Highlight the text
              },
            },
            theme: 'snow',
            placeholder:'Enter text...'
          });
      } catch (error) {
          console.error("Error creating Quill editor:", error);
      }
  } else {
      console.error("Element with #AnswereditorContainer not found!");
  }
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
        questionId: this.selectedQuestion?.id,
        question: this.selectedQuestion.title
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

  editAnswer(answerId: number,answer: string) {
    const dialogRef = this.dialog.open(EditAnswerComponent, {
      width: '600px',
      data: {
        id: this.technologyId,
        questionId: this.selectedQuestion?.id,
        question: this.selectedQuestion.title,
        answerId: answerId,
        answer: answer
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