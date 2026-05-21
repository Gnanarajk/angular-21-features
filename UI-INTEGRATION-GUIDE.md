# UI Integration Guide — Angular 21 + Material + Tailwind

> This guide documents how the ClickShip UI is built, explains every integration
> decision, and gives you a step-by-step learning path to extend or recreate the
> layout yourself.

---

## Table of Contents

1. [Tech Stack Overview](#1-tech-stack-overview)
2. [Angular Material Setup](#2-angular-material-setup)
3. [Tailwind CSS v4 Setup](#3-tailwind-css-v4-setup)
4. [Using Material and Tailwind Together](#4-using-material-and-tailwind-together)
5. [Bootstrap vs Tailwind — Which Should You Use?](#5-bootstrap-vs-tailwind--which-should-you-use)
6. [Layout Architecture](#6-layout-architecture)
7. [Component Walkthroughs](#7-component-walkthroughs)
8. [Step-by-Step Learning Path](#8-step-by-step-learning-path)

---

## 1. Tech Stack Overview

| Layer | Tool | Version |
|---|---|---|
| Framework | Angular (standalone) | 21.x |
| Component Library | Angular Material (M3) | 21.x |
| Utility CSS | Tailwind CSS | 4.x |
| State Management | NgRx Signals + Store | 21.x |
| Build | Angular CLI + esbuild | 21.x |
| CSS Pre-processor | SCSS | — |
| PostCSS | `@tailwindcss/postcss` | 4.x |

**None of these tools conflict.** They occupy different layers:
- Angular Material provides **pre-built, accessible components** (toolbar, menu, button, icon, divider…).
- Tailwind provides **low-level utility classes** for spacing, colour, typography, and responsive layout.
- SCSS provides **nesting and variables** inside component stylesheets.

---

## 2. Angular Material Setup

### Installation

```bash
ng add @angular/material
```

`ng add` does four things automatically:
1. Installs `@angular/material` and `@angular/cdk`.
2. Adds `provideAnimationsAsync()` to `app.config.ts`.
3. Imports the Roboto font and Material Icons in `index.html`.
4. Adds the base `@use` line to `styles.scss`.

If you set up manually (as this project did), you need to do those four steps yourself.

### Theme Configuration (`src/styles.scss`)

Angular Material v3 uses a single `mat.theme()` mixin that wires up colour,
typography, and density for every component in one call:

```scss
@use '@angular/material' as mat;

// Provides the baseline CSS that all Material components need
// (elevation, ripple, focus-ring, etc.)
@include mat.core();

// Apply the M3 theme to the root element.
// All descendant Material components inherit this automatically.
html {
  @include mat.theme((
    color: (
      theme-type: light,       // 'light' or 'dark'
      primary: mat.$azure-palette, // blue family — matches our brand
    ),
    typography: Roboto,        // the font declared in index.html
    density: 0,                // 0 = comfortable, -1 = compact, -2 = dense
  ));
}
```

**Key things to understand:**
- `mat.$azure-palette` is one of Material's built-in colour palettes (blue tones).
  Others: `mat.$blue-palette`, `mat.$green-palette`, `mat.$rose-palette`, etc.
- `theme-type: dark` gives you a dark mode — you can swap it inside a
  `prefers-color-scheme` media query.
- `density: -1` makes every component slightly smaller — useful for data-dense UIs.

### Available Material Palettes

```
mat.$red-palette      mat.$pink-palette     mat.$purple-palette
mat.$indigo-palette   mat.$blue-palette     mat.$azure-palette
mat.$cyan-palette     mat.$teal-palette     mat.$green-palette
mat.$lime-palette     mat.$yellow-palette   mat.$orange-palette
```

### Using Material Components in Standalone Angular

Import **only the modules you need** in each component's `imports` array:

```typescript
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatButtonModule }   from '@angular/material/button';
import { MatIconModule }     from '@angular/material/icon';
import { MatMenuModule }     from '@angular/material/menu';
import { MatDividerModule }  from '@angular/material/divider';
import { MatTooltipModule }  from '@angular/material/tooltip';
import { MatCardModule }     from '@angular/material/card';
import { MatTableModule }    from '@angular/material/table';
import { MatInputModule }    from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  // ...
})
export class MyComponent {}
```

> **Tip:** In Angular 21 you don't need `NgModule` at all. Standalone components
> import directly. Each import is tree-shaken — only what you import ships to the
> browser.

---

## 3. Tailwind CSS v4 Setup

### What Changed in v4 vs v3

| | Tailwind v3 | Tailwind v4 |
|---|---|---|
| Config file | `tailwind.config.js` | No config file needed by default |
| CSS entry | `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss"` |
| PostCSS plugin | `tailwindcss` | `@tailwindcss/postcss` |
| Custom colours | `theme.extend.colors` in config | CSS custom properties |
| Content scanning | `content: ['./src/**/*.html']` | Automatic (scans all files) |

### Installation

```bash
npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer
```

### PostCSS Configuration (`postcss.config.mjs`)

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

This is the **only** config file Tailwind v4 needs. It hooks into Angular's
existing PostCSS pipeline (esbuild calls PostCSS for every CSS file).

### How Angular processes styles

```
Component .scss  ──► Dart Sass ──► CSS  ──► PostCSS (Tailwind) ──► Browser
Global styles.scss ──► same pipeline
```

Because PostCSS runs after SCSS, you can safely use `@apply` in any `.scss`
file — Tailwind resolves it during the PostCSS step.

### Using Tailwind Utilities in Templates

```html
<!-- Tailwind utility classes work directly in Angular HTML templates -->
<div class="flex items-center gap-4 p-6 rounded-xl shadow-md bg-white">
  <span class="text-lg font-semibold text-slate-800">Hello</span>
</div>
```

### Using `@apply` in SCSS Component Files

```scss
// src/app/some-feature/some-feature.scss
.card {
  @apply rounded-xl shadow-md bg-white p-6;

  &:hover {
    @apply shadow-lg;
  }
}
```

> **When to use `@apply` vs inline classes?**
> - Use **inline classes** for one-off utility combos in templates.
> - Use **`@apply`** when the same combo appears in multiple places inside
>   a component's stylesheet — it avoids repetition without creating
>   a global class.

### Custom Design Tokens in v4

In Tailwind v4, you add custom colours/spacing/fonts via CSS custom properties
inside an `@theme` block (no `tailwind.config.js` needed):

```css
/* in styles.scss or a dedicated tokens.css */
@theme {
  --color-brand: #0284c7;       /* sky-600 */
  --color-brand-dark: #0369a1;  /* sky-700 */
  --font-display: 'Roboto', sans-serif;
  --spacing-section: 4rem;
}
```

These tokens become Tailwind utilities automatically:
```html
<div class="bg-brand text-white font-display p-section">...</div>
```

---

## 4. Using Material and Tailwind Together

### They live in different layers — no real conflict

- Angular Material styles are scoped to its own CSS custom properties (`--mat-*`).
- Tailwind utilities are plain CSS classes.
- The only area where they can clash is **CSS resets**.

### Tailwind's Preflight vs Material's baseline

Tailwind v3 shipped a **Preflight** (global reset) that zeroed out browser
defaults. Material's baseline also does light resetting. Using both together
in v3 could break Material component styling.

**In Tailwind v4, Preflight is opt-in** and is not included when you just use
`@import "tailwindcss"` without explicitly enabling it. This means the conflict
is gone by default.

```scss
// If you want Tailwind's preflight AND Material, add preflight explicitly
// and then reset only what conflicts:
@import "tailwindcss/preflight" layer(base);

// Then override the few things Material needs:
:root {
  line-height: normal; // Material sets this; Tailwind's preflight changes it
}
```

### Practical Rules for Using Both

| Situation | Use |
|---|---|
| Pre-built interactive widget (button, dialog, table, menu) | Angular Material component |
| Spacing, flexbox/grid, colours on your own elements | Tailwind utilities |
| Typography scale for your own text | Tailwind (`text-lg`, `font-semibold`) |
| Typography for Material components | Let Material handle it (it uses Roboto tokens) |
| Responsive breakpoints | Tailwind (`md:`, `lg:`) — consistent across your whole app |
| Dark mode | Material `theme-type: dark` for components + Tailwind `dark:` for your own elements |

### Example — Mixed Component

```html
<!-- Material card shell, Tailwind for spacing and grid inside -->
<mat-card class="p-6 rounded-2xl">
  <mat-card-header>
    <mat-card-title class="text-xl font-bold text-slate-800">
      Shipment #1042
    </mat-card-title>
  </mat-card-header>

  <mat-card-content>
    <dl class="grid grid-cols-2 gap-4 mt-4 text-sm text-slate-600">
      <div>
        <dt class="font-medium text-slate-400 uppercase tracking-wide text-xs">Status</dt>
        <dd class="mt-1">In Transit</dd>
      </div>
      <div>
        <dt class="font-medium text-slate-400 uppercase tracking-wide text-xs">ETA</dt>
        <dd class="mt-1">2 days</dd>
      </div>
    </dl>
  </mat-card-content>

  <mat-card-actions class="mt-4">
    <button mat-flat-button color="primary" class="w-full">Track Shipment</button>
  </mat-card-actions>
</mat-card>
```

---

## 5. Bootstrap vs Tailwind — Which Should You Use?

### Short answer: **Use Tailwind. Skip Bootstrap.**

Here is why:

### Bootstrap

**Pros:**
- Very quick to get a UI running — pre-built grid, navbar, cards, modals out of the box.
- Large community, tons of examples, easy to find copy-paste templates.

**Cons:**
- **Conflicts heavily with Angular Material.** Both ship a CSS reset, a button
  system, a grid system, and form styles. They fight each other.
- Bootstrap's components (navbar, modal, dropdown) duplicate what Angular Material
  already provides — you end up shipping two sets of components.
- Bootstrap's grid (`col-md-6`) is fixed 12-column. Tailwind's CSS Grid/Flexbox
  utilities are more flexible and don't impose a column model.
- Bootstrap adds ~30 KB+ of CSS even after tree-shaking. Tailwind v4 generates
  only the utilities you actually use.
- Bootstrap's JavaScript (popper.js, bootstrap.js) conflicts with Angular's
  change detection and Zone.js.

### Tailwind

**Pros:**
- No pre-built components — it just provides utility classes. This means
  **zero conflict** with Angular Material components.
- Tailwind handles what Material does not: spacing, layout, responsive design,
  colour on your own HTML elements.
- Tiny output — only the classes you reference in your templates are included.
- Pairs perfectly with component libraries (Material, PrimeNG, etc.) precisely
  because it has no opinion on component look-and-feel.

**Cons:**
- Slightly steeper initial learning curve (you write more classes in HTML).
- No pre-built UI kit — you compose from scratch.

### Decision matrix

| Need | Recommendation |
|---|---|
| Already using Angular Material | Use Tailwind |
| Need a pre-built UI without Material | Bootstrap or PrimeNG or DaisyUI |
| Need custom layout/spacing control | Tailwind (always) |
| Building a rapid prototype with no design system | Bootstrap is OK |
| Production app with Angular + proper design system | Angular Material + Tailwind |

### If you absolutely must use Bootstrap alongside Angular Material

```scss
// 1. Import only Bootstrap's grid (not the full bundle)
@import "bootstrap/scss/bootstrap-grid";

// 2. Do NOT import bootstrap-reboot (it will fight Material's reset)
// 3. Do NOT use Bootstrap's button/card/navbar/form classes
//    — those will conflict with mat-button, mat-card, mat-toolbar, mat-form-field
```

Even then, you'll have two separate grid systems in your project. It's not
worth the maintenance cost.

---

## 6. Layout Architecture

### Shell Layout Pattern

The app uses a **Shell layout route** to separate authenticated pages (with nav
+ footer) from the login page (standalone, full screen):

```
app.routes.ts
├── /login          → Login component   (no shell — full screen)
└── / (Shell)       → Shell component   (Nav + main + Footer)
    ├── /shipments  → ShipmentSearch
    ├── /orders     → OrderList
    ├── /products   → ProductList       (adminGuard)
    ├── /users      → usersRoute        (authGuard)
    └── /percent-calc, /temp-convertor, /loan-eligibility
```

**Why Shell as a layout route?**

Instead of conditionally showing/hiding the nav in `app.html` based on auth
state, we use Angular's router to compose layouts. This means:

- No `*ngIf` checking `isLoggedIn` in the root component.
- Each layout (shell vs. full-screen) is its own component with its own styles.
- Adding a new layout (e.g. an admin layout with a sidebar) is just a new route parent.

### File structure

```
src/app/core/layout/
├── shell/
│   ├── shell.ts          ← layout component (nav + main + footer)
│   ├── shell.html
│   └── shell.scss
├── nav/nav/
│   ├── nav.ts            ← sticky Material toolbar
│   ├── nav.html
│   └── nav.scss
└── footer/
    ├── footer.ts         ← dark footer with brand + links
    ├── footer.html
    └── footer.scss
```

### Shell CSS — sticky footer technique

```scss
// shell.scss
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;   // shell fills full viewport height

  .shell-main {
    flex: 1;            // grows to push footer to the bottom
  }
}
```

---

## 7. Component Walkthroughs

### Nav (Sticky Header)

**File:** `src/app/core/layout/nav/nav/`

Uses: `MatToolbar`, `MatButton`, `MatIcon`, `MatMenu`, `MatTooltip`, `RouterLink`, `RouterLinkActive`

Key techniques:
- `color="primary"` on `<mat-toolbar>` applies the theme's primary colour automatically.
- `routerLinkActive="nav-link-active"` adds the CSS class when the route is active.
- Two menus: `#userMenu` (account actions) and `#mobileNav` (hamburger on mobile).
- `[matMenuTriggerFor]="userMenu"` wires a button to open its menu.
- Responsive: `.desktop-nav` uses `display: none` on mobile and `display: flex`
  at ≥768 px. `.mobile-menu-btn` does the opposite.
- `position: sticky; top: 0; z-index: 100` keeps the header visible while scrolling.

```html
<!-- Wiring a button to open a named menu -->
<button mat-icon-button [matMenuTriggerFor]="myMenu">
  <mat-icon>more_vert</mat-icon>
</button>
<mat-menu #myMenu="matMenu">
  <button mat-menu-item>Option A</button>
</mat-menu>
```

### Footer

**File:** `src/app/core/layout/footer/`

Uses: `MatIcon`, `MatDivider`, `RouterLink`

Key techniques:
- Dark background (`#0f172a` = Tailwind's `slate-900`) for contrast with the page.
- `margin-top: auto` inside the shell flex column pushes footer to the bottom.
- `mat-divider` renders a subtle `<hr>`-like separator between sections.
- `{{ year }}` is a component property (`readonly year = new Date().getFullYear()`).

### Shell

**File:** `src/app/core/layout/shell/`

Just a layout container — it has no business logic.
It imports `Nav`, `Footer`, and `RouterOutlet`, renders them in a flex column,
and lets the router fill `<router-outlet>` with the active child route.

---

## 8. Step-by-Step Learning Path

### Step 1 — Understand Material theming

1. Open `src/styles.scss`.
2. Change `primary: mat.$azure-palette` to `mat.$green-palette`.
3. Save and watch every Material component (buttons, toolbar, menus) update.
4. Try `theme-type: dark` and see the automatic dark theme.
5. Change `density` to `-1` or `-2` and see components shrink.

**Goal:** Understand that one theme mixin controls the entire visual identity.

---

### Step 2 — Add a new Material component

Add a badge to the Shipments nav link showing a count:

```typescript
// nav.ts
import { MatBadgeModule } from '@angular/material/badge';

// add MatBadgeModule to imports[]
shipmentCount = 3; // in real life this comes from a store selector
```

```html
<!-- nav.html -->
<a mat-button routerLink="/shipments" routerLinkActive="nav-link-active" class="nav-link">
  <mat-icon [matBadge]="shipmentCount" matBadgeColor="warn">local_shipping</mat-icon>
  <span>Shipments</span>
</a>
```

**Goal:** Learn how to discover and import a new Material module.

---

### Step 3 — Add a page with a Material table

```typescript
// In any feature component
import { MatTableModule } from '@angular/material/table';
import { MatSortModule }  from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
```

```html
<mat-table [dataSource]="dataSource" matSort>
  <ng-container matColumnDef="name">
    <mat-header-cell *matHeaderCellDef mat-sort-header>Name</mat-header-cell>
    <mat-cell *matCellDef="let row">{{ row.name }}</mat-cell>
  </ng-container>
  <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
  <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
</mat-table>
<mat-paginator [pageSize]="10" showFirstLastButtons></mat-paginator>
```

**Goal:** Learn the column-def / header-row / data-row pattern that every
Material table uses.

---

### Step 4 — Add a Tailwind-styled card grid

Add this to any feature template to get a responsive card grid:

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
  @for (item of items; track item.id) {
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6
                hover:shadow-md transition-shadow duration-200">
      <h3 class="text-base font-semibold text-slate-800 mb-1">{{ item.name }}</h3>
      <p class="text-sm text-slate-500">{{ item.description }}</p>
    </div>
  }
</div>
```

**Goal:** Learn Tailwind's responsive grid prefix (`sm:`, `lg:`) and how to
compose a card without a pre-built component.

---

### Step 5 — Add a Material dialog

```typescript
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';

export class ShipmentListComponent {
  private dialog = inject(MatDialog);

  openConfirm(id: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { shipmentId: id },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) this.delete(id);
    });
  }
}
```

**Goal:** Learn Angular Material's overlay/dialog pattern for confirmations and
forms.

---

### Step 6 — Add a sidebar with MatSidenav (responsive layout variant)

Replace the Shell layout with one that has a collapsible sidebar for desktop
navigation (common in admin dashboards):

```html
<!-- alternative shell template -->
<mat-sidenav-container class="h-screen">
  <mat-sidenav mode="side" opened class="w-64 p-4">
    <!-- sidebar nav links here -->
  </mat-sidenav>
  <mat-sidenav-content>
    <app-nav></app-nav>
    <main class="p-8"><router-outlet /></main>
  </mat-sidenav-content>
</mat-sidenav-container>
```

**Goal:** Understand how to switch between a top-nav layout and a sidebar layout
by swapping the shell component.

---

## Quick Reference

### Most-used Material modules

```
MatToolbarModule      — sticky header bars
MatButtonModule       — mat-button, mat-flat-button, mat-icon-button
MatIconModule         — mat-icon (Google Material Icons)
MatMenuModule         — dropdown menus
MatCardModule         — content cards
MatTableModule        — data tables
MatFormFieldModule    — form field wrappers
MatInputModule        — text inputs inside form fields
MatSelectModule       — dropdown selects
MatDialogModule       — modal dialogs
MatSnackBarModule     — toast notifications
MatProgressSpinnerModule — loading indicators
MatBadgeModule        — notification badges on icons
MatSidenavModule      — sidebar/drawer layouts
MatDividerModule      — horizontal/vertical separators
MatTooltipModule      — hover tooltips
MatChipsModule        — pill-style tags/filters
MatAutocompleteModule — search-with-suggestions inputs
```

### Most-used Tailwind utility groups

```
Layout:    flex, grid, grid-cols-*, gap-*, col-span-*
Spacing:   p-*, m-*, px-*, py-*, mt-*, mb-*
Sizing:    w-*, h-*, min-h-screen, max-w-*
Text:      text-sm/base/lg/xl, font-medium/semibold/bold, text-slate-*
Colours:   bg-white, bg-slate-*, border-slate-*, text-blue-*
Borders:   rounded-*, border, border-*
Shadow:    shadow-sm, shadow-md, shadow-lg
Hover:     hover:bg-*, hover:shadow-*, hover:text-*
Responsive: sm:*, md:*, lg:*, xl:*
Transition: transition-*, duration-200, ease-in-out
```

---

*Last updated: {{ currentYear }} — Angular 21 / Angular Material 21 / Tailwind 4*
