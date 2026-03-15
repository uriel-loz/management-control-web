import {
  Component,
  DestroyRef,
  forwardRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Typeahead bajo demanda — el endpoint y la lógica de búsqueda son externos.
 *
 * Uso:
 * ```html
 * <app-autocomplete-async
 *   formControlName="category_id"
 *   [searchFn]="searchCategories"
 *   displayField="name"
 *   valueField="id"
 *   label="Categoría"
 * />
 * ```
 *
 * ```ts
 * searchCategories = (keyword: string) =>
 *   this.categoriesApi.getCategories(1, 10, { search: keyword })
 *     .pipe(map(r => r.data.data));
 * ```
 */
@Component({
  selector: 'app-autocomplete-async',
  templateUrl: './autocomplete-async.component.html',
  styleUrl: './autocomplete-async.component.scss',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteAsyncComponent),
      multi: true,
    },
  ],
})
export class AutocompleteAsyncComponent<T extends Record<string, unknown> | Record<string, string | number>>
  implements ControlValueAccessor, OnInit
{
  // ── Inputs ────────────────────────────────────────────────────────────────
  /** Función que recibe el keyword y retorna un Observable con los resultados */
  readonly searchFn      = input.required<(keyword: string) => Observable<T[]>>();
  readonly displayField  = input.required<keyof T>();
  readonly valueField    = input.required<keyof T>();
  readonly label         = input<string>('');
  readonly placeholder   = input<string>('Escribe para buscar...');
  readonly debounceMs    = input<number>(300);
  readonly minLength     = input<number>(1);

  // ── Internal state ────────────────────────────────────────────────────────
  readonly searchControl  = new FormControl<string>('', { nonNullable: true });
  readonly results        = signal<T[]>([]);
  readonly isLoading      = signal(false);
  readonly showEmpty      = signal(false);

  private selectedValue: unknown = null;
  private readonly search$ = new Subject<string>();
  private readonly destroyRef = inject(DestroyRef);

  // ── ControlValueAccessor callbacks ───────────────────────────────────────
  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    // Pipeline de búsqueda
    this.search$
      .pipe(
        debounceTime(this.debounceMs()),
        distinctUntilChanged(),
        filter((term) => term.length >= this.minLength()),
        tap(() => {
          this.isLoading.set(true);
          this.showEmpty.set(false);
          this.results.set([]);
        }),
        switchMap((term) => this.searchFn()(term)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (items) => {
          this.isLoading.set(false);
          this.results.set(items);
          this.showEmpty.set(items.length === 0);
        },
        error: () => {
          this.isLoading.set(false);
          this.results.set([]);
          this.showEmpty.set(true);
        },
      });

    // Propagar cambios del input al pipeline
    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((text) => {
        if (!text) {
          this.results.set([]);
          this.showEmpty.set(false);
          this.isLoading.set(false);
          this.selectedValue = null;
          this.onChange(null);
        } else {
          this.search$.next(text);
        }
      });
  }

  // ── Selección de una opción ───────────────────────────────────────────────
  onOptionSelected(item: T): void {
    this.selectedValue = item[this.valueField()];
    this.onChange(this.selectedValue);
    this.onTouched();
  }

  /** Texto que muestra el input una vez seleccionada una opción */
  displayFn = (item: T | null): string => {
    if (!item) return '';
    return String(item[this.displayField()]);
  };

  // ── ControlValueAccessor ─────────────────────────────────────────────────
  writeValue(value: unknown): void {
    this.selectedValue = value ?? null;
    // En modo edición el padre puede pasar un label para mostrar
    // Si pasa un string lo mostramos directamente; si pasa null limpiamos
    if (value == null) {
      this.searchControl.setValue('', { emitEvent: false });
    }
    // El padre es responsable de pasar el display label si quiere prellenar
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled
      ? this.searchControl.disable()
      : this.searchControl.enable();
  }

  onBlur(): void {
    this.onTouched();

    // Si el usuario no seleccionó nada y hay texto, limpiar
    if (!this.selectedValue && this.searchControl.value) {
      this.searchControl.setValue('', { emitEvent: false });
      this.results.set([]);
      this.showEmpty.set(false);
    }
  }
}
