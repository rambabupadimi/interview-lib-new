
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
  selector: 'app-edit-answer',
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
    <div class="px-12 py-12">
    <form [formGroup]="form" (ngSubmit)="submit()">
    <div class="answer">
            <div class="py-4">Enter Answer :</div>
            <div class="NgxEditor__Wrapper" style="background: white;border-radius: 6px;border: none;">
                <div #answerEditorContainer class="editor-container" aria-placeholder="Enter question here.."></div>
              </div>
     </div>

      <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
        <button mat-stroked-button type="button"
              class="custom-stroked-btn !text-black !border-gray-300 hover:bg-gray-300 hover:text-gray-900 hover:border-gray-400 transition-colors mx-4"
            (click)="close()">Cancel</button>

            <button mat-stroked-button  type="submit"  class="custom-stroked-btn !text-black !border-gray-300 hover:bg-gray-300 hover:text-gray-900 hover:border-gray-400 transition-colors">
              {{ loading ? 'Submitting...' : 'Submit' }}
            </button>
      </div>
    </form>
</div>

  `
})
export class EditAnswerComponent implements  AfterViewInit {
  form: FormGroup;

  @ViewChild("answerEditorContainer")
  answerEditorContainer?: ElementRef;
  answerEditor: any;
  answerContent: any = '';
  loading = false;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<EditAnswerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { answerId: number, answer: string }
  ) {
    this.form = this.fb.group({
      answer_text: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.initAnswerEditor();
   // this.answerEditor.setText(this.data.answer)

    if(this.answerEditor?.root) {
      this.answerEditor.root.innerHTML = this.data.answer;
    }
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
    this.loading = true;
    this.answerContent = this.answerEditor?.root.innerHTML;
    if (this.answerContent.length > 0) {
      this.http.put(`${environment.apiUrl}/questions/answers/${this.data.answerId}`, {
        answer_text: this.answerContent
      }).subscribe(() => {
        this.loading = false;
        this.dialogRef.close('refresh');
      });
    }
  }


  close() {
    this.dialogRef.close();
  }
}