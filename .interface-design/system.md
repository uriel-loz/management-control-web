# Interface Design System
# management-control-web

---

## Direction & Feel

Panel de control administrativo. Preciso, no decorativo. El producto vive en el mundo de la
administración de sistemas — políticas, niveles de autoridad, registros de acceso.

**No es cálido. Es exacto.** Como un documento firmado, no como una app de productividad.

---

## Palette

Todas las decisiones de color se derivan de estos primitivos. Sin hex valores sueltos.

| Token global | Valor | Rol |
|---|---|---|
| `--sidebar-bg` / brand-dark | `#0b0f19` | Superficies de autoridad: cabeceras de sección, badges activos, botones primarios |
| `--bg-color` | `#f5f7f9` | Canvas de página |
| `--accent-primary` | `#06b6d4` | Cyan — estado activo, contadores, highlights informativos |
| `--border-color` | `#eaecef` | Bordes de controles inactivos |
| `--text-main` | `#1f2937` | Texto primario |
| `--text-muted` | `#6b7280` | Labels secundarios, metadata |
| `--sidebar-text` | `#9ca3af` | Iconos de metadata, texto terciario |
| `--sidebar-text-active` | `#f9fafb` | Texto sobre superficies oscuras (#0b0f19) |

**Superficie de tarjeta:** `#ffffff` sobre canvas `#f5f7f9`.
**Superficie inset (metadata, inputs):** ligeramente más oscuro que el canvas — comunica "contenido recibido".

---

## Depth Strategy

**Borders-only.** Sin sombras decorativas.

Herramienta densa de administración — las sombras añaden calidez que no corresponde al dominio.
La jerarquía se construye exclusivamente con color de superficie y borde.

| Nivel | Descripción | Implementación |
|---|---|---|
| Canvas | Fondo de página | `#f5f7f9` |
| Card | Tarjeta estándar | `background: #fff; border: 1px solid rgba(0,0,0,0.08)` |
| Card header | Cabecera de sección de autorización | `background: #0b0f19` |
| Inset | Metadata, datos de solo lectura | `border: 1px solid rgba(0,0,0,0.08)` sin sombra, sin background distinto |
| Separator | Filas dentro de una tarjeta | `border-bottom: 1px solid rgba(0,0,0,0.06)` |

**No mezclar** borders + shadows en el mismo componente.

---

## Spacing

Base unit: **4px**.

| Escala | Valor | Uso |
|---|---|---|
| micro | 4px | Gap entre icon y texto |
| xs | 6–8px | Gap entre chips, gap interno de badges |
| component | 10–12px | Padding de filas, gap entre items de metadata |
| card | 14–16px | Padding horizontal de tarjetas |
| section | 20–24px | Gap entre secciones, margin-top del save-row |
| major | 28px | Gap entre columnas del grid principal |

---

## Typography

**DM Sans** — UI, labels, nombres de módulo, cabeceras de sección.
**JetBrains Mono** — valores numéricos, contadores, datos de metadata (fechas, cantidades).

Ambas cargadas vía Google Fonts en `src/styles.scss`.

| Nivel | Fuente | Size | Weight | Letter-spacing | Uso |
|---|---|---|---|---|---|
| Section label | DM Sans | 11px | 600 | 0.08em | Cabeceras uppercase de sección |
| Module name | DM Sans | 13px | 500 | — | Nombre de módulo en filas |
| Body / label | DM Sans | 12–13px | 400–500 | — | Labels de metadata, texto secundario |
| Chip label | DM Sans | 12px | 500 | — | Texto de permission chips |
| Data value | JetBrains Mono | 11–12px | 500 | 0.02em | Contadores, fechas, cantidades |

---

## Border Radius

| Contexto | Valor |
|---|---|
| Tarjetas de sección, metadata | `8px` |
| Permission chips, badges | `4px` |
| Botones | definido por Angular Material |

No mezclar radios grandes en elementos pequeños.

---

## Component Patterns

### Permission Section Card

Cada grupo de permisos (ej. Home, Administration, Operations) es una tarjeta independiente con:

- **Cabecera `#0b0f19`:** nombre en DM Sans 600 uppercase + contador de activos en `#06b6d4` JetBrains Mono
- **Cuerpo:** lista de filas de módulo separadas por `border-bottom: 1px solid rgba(0,0,0,0.06)`
- **Última fila:** sin border-bottom (clase `.last`)
- Tarjetas consecutivas separadas con `margin-top: 12px`

```scss
.section-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  & + .section-card { margin-top: 12px; }
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #0b0f19;
}
.section-name {
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: #f9fafb;
}
.section-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; color: #06b6d4;
}
```

### Permission Chip (toggle)

Dos estados visuales únicos, sin estado intermedio:

- **Inactivo:** `border: 1px solid #eaecef`, texto `#6b7280`, fondo transparente
- **Activo:** `background: #0b0f19`, `border-color: #0b0f19`, texto `#f9fafb`
- **Hover inactivo:** `border-color: #0b0f19`, texto `#0b0f19`
- **Focus:** `outline: 2px solid #06b6d4; outline-offset: 2px`
- Transición: `120ms ease`

Los permisos se ordenan: Leer → Crear → Editar → Eliminar.
Activar cualquier permiso no-read auto-activa el permiso de Leer del mismo módulo.

```scss
.perm-chip {
  padding: 3px 10px;
  border-radius: 4px;
  border: 1px solid #eaecef;
  background: transparent;
  font-size: 12px; font-weight: 500;
  color: #6b7280;
  transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
  &.active { background: #0b0f19; border-color: #0b0f19; color: #f9fafb; }
  &:hover:not(.active) { border-color: #0b0f19; color: #0b0f19; }
  &:focus-visible { outline: 2px solid #06b6d4; outline-offset: 2px; }
}
```

### Metadata Table (rol seleccionado)

Lista de filas con `border-bottom: 1px solid rgba(0,0,0,0.06)` — **no** usar `border-left` decorativo.
Valores numéricos/fecha en `JetBrains Mono 500 12px`.
Iconos de Material en `#9ca3af` (texto terciario), no en `#0b0f19`.

### Columna de permisos — cabecera

Label uppercase + controles Desmarcar/Marcar en una sola fila `justify-content: space-between`.
`<h3>` plano eliminado — reemplazado por `.permissions-title` con el mismo estilo de section label.

### Save row

`border-top: 1px solid rgba(0,0,0,0.08)` + `margin-top: 20px` + `padding-top: 16px`.
El borde ancla visualmente el botón al final del panel sin añadir una tarjeta extra.

### Scrollbar discreta

```scss
&::-webkit-scrollbar { width: 4px; }
&::-webkit-scrollbar-track { background: transparent; }
&::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }
```

---

## Button Conventions

Heredadas del proyecto — no modificar:

- **Primario (Guardar, Crear, Marcar todos):** `background: #0b0f19 !important; color: #f5f7f9 !important`
  No usar `color="primary"` de Angular Material.
- **Secundario/destructivo (Cancelar, Eliminar):** `mat-stroked-button`, `border-color: #eaecef`
- **Destructivo:** `color: #d32f2f`
- **Neutral secundario:** `color: #0b0f19`

---

## Navigation Context

Grid de dos columnas: `3fr auto 7fr` con `mat-divider` vertical.
La columna izquierda selecciona y gestiona el rol; la derecha configura sus permisos.
Ambas columnas usan el mismo canvas — no superficies diferenciadas por color de fondo.
