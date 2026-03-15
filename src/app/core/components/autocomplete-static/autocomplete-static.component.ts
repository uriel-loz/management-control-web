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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Typeahead con datos en cliente.
 *
 * Uso:
 * ```html
 * <app-autocomplete-static
 *   formControlName="category_id"
 *   [options]="categories()"
 *   displayField="name"
 *   valueField="id"
 *   label="Categoría"
 * />
 * ```
 */
@Component({
  selector: 'app-autocomplete-static',
  templateUrl: './autocomplete-static.component.html',
  styleUrl: './autocomplete-static.component.scss',
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
      useExisting: forwardRef(() => AutocompleteStaticComponent),
      multi: true,
    },
  ],
})
export class AutocompleteStaticComponent<T extends Record<string, unknown> | Record<string, string | number>>
  implements ControlValueAccessor, OnInit
{
  // ── Inputs ────────────────────────────────────────────────────────────────
  readonly options      = input.required<T[]>();
  readonly displayField = input.required<keyof T>();
  readonly valueField   = input.required<keyof T>();
  readonly label        = input<string>('');
  readonly placeholder  = input<string>('');

  // ── Internal state ────────────────────────────────────────────────────────
  /** Control del input de texto visible al usuario */
  readonly searchControl = new FormControl<string>('', { nonNullable: true });

  /** Opciones filtradas según lo que se escribe */
  readonly filteredOptions = signal<T[]>([]);

  /** Valor primitivo seleccionado (lo que va al FormControl externo) */
  private selectedValue: unknown = null;

  /**
   * Flag que indica que el usuario está en proceso de seleccionar
   * una opción del panel. Evita que onBlur limpie el campo antes
   * de que optionSelected se registre.
   */
  private isSelecting = false;

  private readonly destroyRef = inject(DestroyRef);

  // ── ControlValueAccessor callbacks ───────────────────────────────────────
  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.filteredOptions.set(this.options());

    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((text) => {
        // valueChanges puede emitir el objeto T justo después de que
        // displayWith lo pone de vuelta — ignorar si no es string
        if (typeof text !== 'string') return;

        this.filteredOptions.set(this.filter(text));

        if (!text) {
          this.selectedValue = null;
          this.onChange(null);
        }
      });
  }

  // ── Selección de una opción ───────────────────────────────────────────────
  onOptionSelected(item: T): void {
    this.isSelecting = false;
    this.selectedValue = item[this.valueField()];

    // Escribir el label explícitamente en el searchControl para que
    // valueChanges no dispare el pipeline de filtrado ni limpie el valor
    const label = String(item[this.displayField()]);
    this.searchControl.setValue(label, { emitEvent: false });

    this.onChange(this.selectedValue);
    this.onTouched();
  }

  /**
   * Se llama en mousedown del panel para marcar que el usuario
   * está en proceso de seleccionar. Esto hace que onBlur no limpie
   * el campo antes de que optionSelected se registre.
   */
  onPanelMousedown(event: MouseEvent): void {
    event.preventDefault(); // evita que el input pierda el foco
    this.isSelecting = true;
  }

  // ── ControlValueAccessor ─────────────────────────────────────────────────
  writeValue(value: unknown): void {
    this.selectedValue = value ?? null;
    const label = this.resolveLabel(value);
    this.searchControl.setValue(label, { emitEvent: false });
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.searchControl.disable() : this.searchControl.enable();
  }

  onBlur(): void {
    // El usuario está seleccionando una opción del panel — no limpiar
    if (this.isSelecting) return;

    this.onTouched();

    const raw = this.searchControl.value;

    // Si el valor no es string (objeto T en tránsito) o está vacío, limpiar
    if (!raw || typeof raw !== 'string') {
      this.clear();
      return;
    }

    // Si el texto no coincide exactamente con ninguna opción, limpiar
    const match = this.options().find(
      (o) => String(o[this.displayField()]).toLowerCase() === raw.toLowerCase()
    );

    if (!match) {
      this.clear();
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private filter(text: string): T[] {
    if (!text) return this.options();
    const lower = text.toLowerCase();
    return this.options().filter((o) =>
      String(o[this.displayField()]).toLowerCase().includes(lower)
    );
  }

  private resolveLabel(value: unknown): string {
    if (value == null) return '';
    const match = this.options().find((o) => o[this.valueField()] === value);
    return match ? String(match[this.displayField()]) : '';
  }

  private clear(): void {
    this.searchControl.setValue('', { emitEvent: false });
    this.selectedValue = null;
    this.onChange(null);
    this.filteredOptions.set(this.options());
  }
}
