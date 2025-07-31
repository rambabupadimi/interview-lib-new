
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'admin-portal/src/environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import hljs from 'highlight.js'; // Import Highlight.js
hljs.configure({
  languages: ['javascript', 'python', 'java', 'html', 'css'] // Add desired languages
});


@Component({
  selector: 'app-add-answer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    QuillModule
  ],
  template: `
    <h2 mat-dialog-title>Add Answer</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" style="padding: 16px;">
    <div class="answer">
            <div>Enter Answer :</div> <br/>
            <div class="NgxEditor__Wrapper" style="background: white;border-radius: 6px;border: none;">
                <div #answerEditorContainer class="editor-container" aria-placeholder="Enter question here.."></div>
              </div>
     </div>

      <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
        <button mat-button type="button" (click)="close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" >Save</button>
      </div>
    </form>
  `
})
export class AddAnswerComponent implements  AfterViewInit {
  form: FormGroup;

  @ViewChild("answerEditorContainer")
  answerEditorContainer?: ElementRef;
  answerEditor: any;
  answerContent: any = '';
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<AddAnswerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { questionId: number }
  ) {
    this.form = this.fb.group({
      answer_text: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.initAnswerEditor();
  }

  initAnswerEditor() {
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
              highlight: (text: any) => hljs.highlightAuto(text).value // Highlight the text
            },
          },
          theme: 'snow',
          placeholder: 'Enter text...'
        });
      } catch (error) {
        console.error("Error creating Quill editor:", error);
      }
    } else {
      console.error("Element with #AnswereditorContainer not found!");
    }
  }

  submit() {
    this.answerContent = this.answerEditor?.root.innerHTML;
    if (this.answerContent.length > 0) {
      this.http.post(`${environment.apiUrl}/questions/${this.data.questionId}/answers`, {
        answer_text: this.answerContent
      }).subscribe(() => {
        this.dialogRef.close('refresh');
      });
    }
  }


  close() {
    this.dialogRef.close();
  }
}