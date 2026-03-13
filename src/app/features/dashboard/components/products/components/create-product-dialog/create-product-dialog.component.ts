import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { Product, UpdateProductRequest, CreateProductRequest } from '../../interfaces/products.interface';
import { environment } from '../../../../../../../environments/environments';

export interface CreateProductDialogData {
  product?: Product;
}

interface ImagePreview {
  file: File;
  objectUrl: string;
}

@Component({
  selector: 'products-create-product-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-product-dialog.component.html',
  styleUrl: './create-product-dialog.component.scss',
})
export class CreateProductDialogComponent implements OnDestroy {
  private readonly dialogRef    = inject(MatDialogRef<CreateProductDialogComponent>);
  private readonly apiService   = inject(ApiService);
  private readonly notification = inject(NotificationService);
  readonly data = inject<CreateProductDialogData>(MAT_DIALOG_DATA, { optional: true });

  readonly isEditMode = computed(() => !!this.data?.product);
  readonly isLoading  = signal(false);

  // ── Imágenes nuevas seleccionadas por el usuario ──────────────────────────
  readonly newImages = signal<ImagePreview[]>([]);

  // ── Imágenes existentes del producto (modo edición) ───────────────────────
  readonly existingImageUrl = computed<string | null>(() => {
    const product = this.data?.product;
    if (!product?.main_image) return null;
    return `${environment.baseUrl}/storage/${product.main_image}`;
  });

  readonly form = new FormGroup({
    name:        new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    slug:        new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    price:       new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)] }),
    quantity:    new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    const product = this.data?.product;
    if (product) {
      this.form.patchValue({
        name:        product.name,
        slug:        product.slug,
        price:       product.price,
        quantity:    product.quantity,
        description: product.description,
      });
    }

    // Auto-generar slug a partir del nombre en modo creación
    this.form.controls.name.valueChanges.subscribe(value => {
      if (!this.isEditMode()) {
        this.form.controls.slug.setValue(this.generateSlug(value), { emitEvent: false });
      }
    });
  }

  ngOnDestroy(): void {
    // Liberar object URLs para evitar memory leaks
    this.newImages().forEach(img => URL.revokeObjectURL(img.objectUrl));
  }

  // ── Manejo de selección de archivos ──────────────────────────────────────
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const incoming = Array.from(input.files).map(file => ({
      file,
      objectUrl: URL.createObjectURL(file),
    }));

    this.newImages.update(current => [...current, ...incoming]);

    // Resetear el input para permitir seleccionar los mismos archivos de nuevo
    input.value = '';
  }

  removeNewImage(index: number): void {
    this.newImages.update(current => {
      URL.revokeObjectURL(current[index].objectUrl);
      return current.filter((_, i) => i !== index);
    });
  }

  // ── Guardar ───────────────────────────────────────────────────────────────
  cancel(): void {
    this.dialogRef.close(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { name, slug, price, quantity, description } = this.form.getRawValue();
    const files = this.newImages().map(img => img.file);

    if (this.isEditMode()) {
      const productId = this.data!.product!.id;
      const payload: UpdateProductRequest = { name, slug, price, quantity: quantity!, description };

      this.apiService.updateProduct(productId, payload).subscribe({
        next: () => {
          if (files.length > 0) {
            this.uploadImagesAndClose(productId, files, 'Producto actualizado exitosamente.');
          } else {
            this.notification.success('Producto actualizado exitosamente.');
            this.dialogRef.close(true);
          }
        },
        error: (error: { error?: { message?: string } }) => {
          this.notification.error(error.error?.message || 'Error al actualizar el producto.');
          this.isLoading.set(false);
        },
      });
    } else {
      const payload: CreateProductRequest = { name, slug, price, quantity: quantity!, description };

      this.apiService.createProduct(payload).subscribe({
        next: (response) => {
          const productId = response.data.id;
          if (files.length > 0) {
            this.uploadImagesAndClose(productId, files, 'Producto creado exitosamente.');
          } else {
            this.notification.success('Producto creado exitosamente.');
            this.dialogRef.close(true);
          }
        },
        error: (error: { error?: { message?: string } }) => {
          this.notification.error(error.error?.message || 'Error al crear el producto.');
          this.isLoading.set(false);
        },
      });
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private uploadImagesAndClose(productId: string, files: File[], successMsg: string): void {
    this.apiService.uploadImages(productId, files).subscribe({
      next: () => {
        this.notification.success(successMsg);
        this.dialogRef.close(true);
      },
      error: (error: { error?: { message?: string } }) => {
        // El producto ya fue guardado — avisar del fallo de imágenes sin revertir
        this.notification.error(error.error?.message || 'El producto se guardó pero ocurrió un error al subir las imágenes.');
        this.isLoading.set(false);
      },
    });
  }

  private generateSlug(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
}
