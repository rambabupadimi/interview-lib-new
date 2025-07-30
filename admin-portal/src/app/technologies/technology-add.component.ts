import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-technology-add',
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
        <mat-card-title>Add Technology</mat-card-title>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Technology Name</mat-label>
              <input matInput formControlName="name" required />
            </mat-form-field>
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="4"></textarea>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
              {{ loading ? 'Submitting...' : 'Submit' }}
            </button>
            <button mat-stroked-button type="button" (click)="cancel()">Cancel</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [``]
})
export class TechnologyAddComponent {
  form: FormGroup;
  loading = false;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }
  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.http.post('/api/admin/technologies', this.form.value).subscribe({
        next: () => {
          this.snackBar.open('Technology added!', 'Close', { duration: 2000 });
          this.router.navigate(['/admin/technologies']);
        },
        error: () => {
          this.snackBar.open('Failed to add technology', 'Close', { duration: 3000 });
        },
        complete: () => (this.loading = false)
      });
    }
  }
  cancel() {
    this.router.navigate(['/admin/technologies']);
  }
} 