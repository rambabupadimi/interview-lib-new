import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-technology-add',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <div class="max-w-2xl mx-auto py-8">
    <div class="flex items-center mb-4">
        <button mat-icon-button (click)="goBack()" aria-label="Back" class="mr-2">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h2 class="text-2xl font-semibold">Add Technology</h2>
      </div>
        <div class="body-section border border-gray-300 rounded-md p-6 bg-white">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Technology Name</mat-label>
              <input matInput formControlName="name" required />
            </mat-form-field>
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="4"></textarea>
            </mat-form-field>

            <div class="flex gap-4 justify-end">

            <button mat-stroked-button type="button" type="submit" [disabled]="form.invalid || loading"  class="custom-stroked-btn !text-black !border-gray-300 hover:bg-gray-300 hover:text-gray-900 hover:border-gray-400 transition-colors">
              {{ loading ? 'Submitting...' : 'Submit' }}
            </button>
            <button mat-stroked-button type="button"
              class="custom-stroked-btn !text-black !border-gray-300 hover:bg-gray-300 hover:text-gray-900 hover:border-gray-400 transition-colors"
            (click)="cancel()">Cancel</button>
</div>


          </form>
        </div>
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
      this.http.post(`${environment.apiUrl}/technologies`, this.form.value).subscribe({
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
  goBack() {
    this.router.navigate(['/admin/technologies']);
  }
}