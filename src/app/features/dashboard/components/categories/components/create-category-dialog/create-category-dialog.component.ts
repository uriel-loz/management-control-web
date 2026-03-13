import { Component, computed, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { Category } from '../../interfaces/categories.interface';

export interface CreateCategoryDialogData {
  category?: Category;
}

@Component({
  selector: 'categories-create-category-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-category-dialog.component.html',
  styleUrl: './create-category-dialog.component.scss',
})
export class CreateCategoryDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateCategoryDialogComponent>);
  private readonly apiService = inject(ApiService);
  private readonly notification = inject(NotificationService);
  readonly data = inject<CreateCategoryDialogData>(MAT_DIALOG_DATA, { optional: true });

  readonly isEditMode = computed(() => !!this.data?.category);
  readonly isLoading = signal(false);

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    const category = this.data?.category;
    if (category) {
      this.form.patchValue({
        name: category['name'],
        description: category['description'],
      });
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { name, description } = this.form.getRawValue();

    if (this.isEditMode()) {
      this.apiService.updateCategory(this.data!.category!['id'], { name, description }).subscribe({
        next: () => {
          this.notification.success('Categoría actualizada exitosamente.');
          this.dialogRef.close(true);
        },
        error: (error: { error?: { message?: string } }) => {
          const message = error.error?.message || 'Error al actualizar la categoría.';
          this.notification.error(message);
          this.isLoading.set(false);
        },
      });
    } else {
      this.apiService.createCategory({ name, description }).subscribe({
        next: () => {
          this.notification.success('Categoría creada exitosamente.');
          this.dialogRef.close(true);
        },
        error: (error: { error?: { message?: string } }) => {
          const message = error.error?.message || 'Error al crear la categoría.';
          this.notification.error(message);
          this.isLoading.set(false);
        },
      });
    }
  }
}
