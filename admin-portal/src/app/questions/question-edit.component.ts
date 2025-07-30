import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-question-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="max-w-2xl mx-auto py-8">
      <mat-card>
        <mat-card-title>Edit Question</mat-card-title>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" required />
            </mat-form-field>
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Content</mat-label>
              <textarea matInput formControlName="content" rows="4"></textarea>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
              {{ loading ? 'Saving...' : 'Save' }}
            </button>
            <button mat-stroked-button type="button" (click)="cancel()">Cancel</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [``]
})
export class QuestionEditComponent implements OnInit {
  form: FormGroup;
  loading = false;
  id: string | null = null;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['']
    });
  }
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.http.get<any>(`/api/admin/questions/${this.id}`).subscribe({
        next: (data) => this.form.patchValue(data),
        error: () => this.snackBar.open('Failed to load question', 'Close', { duration: 3000 })
      });
    }
  }
  onSubmit() {
    if (this.form.valid && this.id) {
      this.loading = true;
      this.http.put(`/api/admin/questions/${this.id}`, this.form.value).subscribe({
        next: () => {
          this.snackBar.open('Question updated!', 'Close', { duration: 2000 });
          this.router.navigate(['/admin/questions']);
        },
        error: () => {
          this.snackBar.open('Failed to update question', 'Close', { duration: 3000 });
        },
        complete: () => (this.loading = false)
      });
    }
  }
  cancel() {
    this.router.navigate(['/admin/questions']);
  }
} 