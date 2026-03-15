import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
import { Product, ProductRequest } from '../../interfaces/products.interface';
import { environment } from '../../../../../../../environments/environments';
import { Category } from '../../../categories/interfaces/categories.interface';
import { ApiService as CategoriesApiService } from '../../../categories/services/api.service';
import { AutocompleteStaticComponent } from '../../../../../../core/components/autocomplete-static/autocomplete-static.component';

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
    AutocompleteStaticComponent,
  ],
  templateUrl: './create-product-dialog.component.html',
  styleUrl: './create-product-dialog.component.scss',
})
export class CreateProductDialogComponent implements OnInit, OnDestroy {
  private readonly dialogRef         = inject(MatDialogRef<CreateProductDialogComponent>);
  private readonly apiService        = inject(ApiService);
  private readonly categoriesService = inject(CategoriesApiService);
  private readonly notification      = inject(NotificationService);
  readonly data = inject<CreateProductDialogData>(MAT_DIALOG_DATA, { optional: true });

  readonly isEditMode = computed(() => !!this.data?.product);
  readonly isLoading  = signal(false);

  readonly categories = signal<Category[]>([]);

  readonly selectedCategories = signal<Category[]>([]);

  readonly selectedCategoryIds = computed(() => this.selectedCategories().map((c) => c.id));

  readonly availableCategories = computed(() => {
    const selectedIds = new Set(this.selectedCategoryIds());
    return this.categories().filter((c) => !selectedIds.has(c.id));
  });

  readonly categorySearchControl = new FormControl<string | null>(null);

  readonly newImages = signal<ImagePreview[]>([]);

  readonly existingImageUrl = computed<string | null>(() => {
    const product = this.data?.product;
    if (!product?.main_image) return null;
    return `${environment.baseUrl}/storage/${product.main_image}`;
  });

  readonly form = new FormGroup({
    name:        new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    price:       new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)] }),
    quantity:    new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    const product = this.data?.product;
    if (product) {
      this.form.patchValue({
        name:        product.name,
        price:       product.price,
        quantity:    product.quantity,
        description: product.description,
      });
      // Prellenar categorías en modo edición
      // ProductCategory tiene menos campos que Category; se completan al cargar el listado en ngOnInit
      if (product.categories?.length) {
        this.selectedCategories.set(product.categories as unknown as Category[]);
      }
    }
  }

  ngOnInit(): void {
    // Cargar listado de categorías
    this.categoriesService.listCategories().subscribe({
      next: (response) => {
        const data = response.data as unknown as Category[];
        this.categories.set(Array.isArray(data) ? data : []);

        // En modo edición, sincronizar objetos completos desde el listado
        // (product.categories solo trae id/name/slug, el listado puede tener más datos)
        if (this.isEditMode() && this.selectedCategories().length) {
          const fullObjects = this.selectedCategories()
            .map((sel) => data.find((c) => c.id === sel.id) ?? sel);
          this.selectedCategories.set(fullObjects);
        }
      },
      error: () => { /* silencioso — el campo queda sin opciones */ },
    });

    // Escuchar selección del autocomplete de categorías
    this.categorySearchControl.valueChanges.subscribe((id) => {
      if (!id) return;
      this.addCategory(id);
      // Resetear el control para permitir buscar otra categoría
      this.categorySearchControl.setValue(null, { emitEvent: false });
    });
  }

  ngOnDestroy(): void {
    this.newImages().forEach((img) => URL.revokeObjectURL(img.objectUrl));
  }

  // ── Gestión de categorías seleccionadas ───────────────────────────────────
  addCategory(id: string): void {
    const category = this.categories().find((c) => c.id === id);
    if (!category) return;
    // Evitar duplicados
    if (this.selectedCategories().some((c) => c.id === id)) return;
    this.selectedCategories.update((current) => [...current, category]);
  }

  removeCategory(id: string): void {
    this.selectedCategories.update((current) => current.filter((c) => c.id !== id));
  }

  // ── Manejo de selección de archivos ──────────────────────────────────────
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const incoming = Array.from(input.files).map((file) => ({
      file,
      objectUrl: URL.createObjectURL(file),
    }));

    this.newImages.update((current) => [...current, ...incoming]);
    input.value = '';
  }

  removeNewImage(index: number): void {
    this.newImages.update((current) => {
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
    const { name, price, quantity, description } = this.form.getRawValue();
    const categories = this.selectedCategoryIds();
    const files        = this.newImages().map((img) => img.file);
    const payload: ProductRequest = { name, price, quantity: quantity!, description, categories };

    if (this.isEditMode()) {
      const productId = this.data!.product!.id;

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

  private uploadImagesAndClose(productId: string, files: File[], successMsg: string): void {
    this.apiService.uploadImages(productId, files).subscribe({
      next: () => {
        this.notification.success(successMsg);
        this.dialogRef.close(true);
      },
      error: (error: { error?: { message?: string } }) => {
        this.notification.error(
          error.error?.message ||
          'El producto se guardó pero ocurrió un error al subir las imágenes.',
        );
        this.isLoading.set(false);
      },
    });
  }
}
