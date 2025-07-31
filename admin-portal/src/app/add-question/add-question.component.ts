import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { environment } from 'admin-portal/src/environments/environment';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>Add Question</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" mat-dialog-content>

      <mat-form-field appearance="fill" class="w-full">
        <mat-label>Enter question</mat-label>
        <textarea matInput formControlName="title"></textarea>
      </mat-form-field>
      <!-- Add more fields as needed -->
      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Save</button>
      </div>
    </form>
  `
})
export class AddQuestionComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      technology_id:[data.id]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.http.post(`${environment.apiUrl}/questions`, this.form.value).subscribe({
        next: () => this.dialogRef.close('refresh'),
        error: err => {
          // Optionally handle error (e.g., show a message)
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
