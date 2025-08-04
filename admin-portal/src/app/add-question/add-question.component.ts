import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { environment } from 'admin-portal/src/environments/environment';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule
  ],
  template: `
<div class="px-12 py-12">
<h2 mat-dialog-title class="py-4"><b>Question</b></h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" mat-dialog-content>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Enter question</mat-label>
        <textarea matInput formControlName="title"></textarea>
      </mat-form-field>

      <p class="py-4">  Optional fields </p>

      <div style="display: flex; gap: 16px;">
        <mat-form-field appearance="outline" style="flex: 1;">
          <mat-label>Organisation Name</mat-label>
          <mat-select formControlName="organisation">
            <mat-option *ngFor="let org of organisations" [value]="org.id">{{ org.name }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" style="flex: 1;">
          <mat-label>Experience Level</mat-label>
          <mat-select formControlName="experience">
            <mat-option *ngFor="let exp of experienceLevels" [value]="exp">{{ exp }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" style="flex: 1;">
          <mat-label>Interview Round Type</mat-label>
          <mat-select formControlName="roundType">
            <mat-option *ngFor="let round of roundTypes" [value]="round">{{ round }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Add more fields as needed -->
      <div mat-dialog-actions align="end">


            <button mat-stroked-button type="button"
              class="custom-stroked-btn !text-black !border-gray-300 hover:bg-gray-300 hover:text-gray-900 hover:border-gray-400 transition-colors"
            (click)="onCancel()">Cancel</button>

            <button mat-stroked-button  type="submit" [disabled]="form.invalid || loading"  class="custom-stroked-btn !text-black !border-gray-300 hover:bg-gray-300 hover:text-gray-900 hover:border-gray-400 transition-colors mx-4">
              {{ loading ? 'Submitting...' : 'Submit' }}
            </button>
      </div>
    </form>
</div>
  `
})
export class AddQuestionComponent {
  form: FormGroup;
  organisations: any = [];
  experienceLevels = ['Fresher', '1-3 years', '3-5 years', '5+ years'];
  roundTypes = ['Technical', 'HR', 'Managerial', 'Coding'];
  loading = false;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      technology_id:[data.id],
      organisation: [''],
      experience: [''],
      roundType: ['']
    });

    // Fetch companies list and assign to organisations
    this.http.get<string[]>(`${environment.apiUrl}/companies`).subscribe({
      next: (companies) => this.organisations = companies,
      error: () => this.organisations = []
    });
  }

  onSubmit() {
    if (this.form.valid) {

      const titleIs = this.form.value.title;
      const technologyId = this.form.value.technology_id;
      const companyId = this.form.value.organisation;

      const request =
          {title: titleIs,
            technology_id:technologyId,
            company_id:companyId,
            experience_id:null
          };


      this.http.post(`${environment.apiUrl}/questions`, request).subscribe({
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
