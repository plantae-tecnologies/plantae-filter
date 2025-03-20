# Plantae Filter

![npm](https://img.shields.io/npm/v/@plantae-tech/plantae-filter?color=green)
[![Docs](https://img.shields.io/badge/Demo-GitHub%20Pages-blue)](https://plantae-tecnologies.github.io/plantae-filter/)

A lightweight JavaScript plugin to transform native `<select>` elements into custom dropdown components with search, multi-select, and virtual list rendering (Clusterize.js).

---

## Installation

### NPM

```bash
npm install @plantae-tech/plantae-filter
```

### CDN (UMD)

```html
<script src="https://plantae-tecnologies.github.io/plantae-filter/plantae-filter.umd.js"></script>
```

### CDN (ES Module)

```html
<script type="module" src="https://plantae-tecnologies.github.io/plantae-filter/plantae-filter.es.js"></script>
```

---

## Usage

### 1. Using with Custom Element (Vanilla JS)

```html
<select id="mySelect" data-options="inline" data-pl-label="Produtos">
  <optgroup label="Frutas">
    <option value="maca">Maçã</option>
    <option value="banana">Banana</option>
  </optgroup>
  <option value="outro">Outro</option>
</select>

<script type="module">
  import { PlantaeFilter } from '@plantae-tech/plantae-filter';

  const select = document.getElementById('mySelect');
  const pf = new PlantaeFilter(select);
</script>
```

### 2. Using programmatically (Node + Vanilla)

```typescript
import { PlantaeFilter } from '@plantae-tech/plantae-filter';

const select = document.querySelector('select');
const pf = new PlantaeFilter(select, { label: 'Produtos', all-text: 'Todos', empty-text: 'Selecione' });

// API Example
pf.addOption({ value: 'uva', text: 'Uva', group: 'Frutas' });
pf.selectOptions(['uva']);
```

---

## Data Attributes

The following attributes can be set directly on the `<select>` element as `data-pl-*`:

| Attribute          | Description                      | Example                          |
| ------------------ | -------------------------------- | -------------------------------- |
| data-pl-label      | Label shown on the badge         | `data-pl-label="Produtos"`       |
| data-pl-all-text   | Text when all items are selected | `data-pl-all-text="Todos"`       |
| data-pl-empty-text | Text when no item is selected    | `data-pl-empty-text="Selecione"` |

---

## Public API

| Method                   | Description                     |
| ------------------------ | ------------------------------- |
| `addOption(option)`      | Add a single option             |
| `addOptions(options)`    | Add multiple options            |
| `selectOptions(values)`  | Select multiple values by value |
| `removeOptions(values)`  | Remove options by value         |
| `removeAllOptions()`     | Remove all options              |
| `clearSelection()`       | Deselect all selected options   |
| `disableOptions(values)` | Disable options by value        |
| `enableOptions(values)`  | Enable options by value         |
| `getSelected()`          | Get all selected options        |
| `getAllOptions()`        | Get all available options       |

---

## Customization

### 1. Using Bootstrap 5 Theme

You can apply the official Bootstrap 5 theme by including the stylesheet:

```html
<link rel="stylesheet" href="https://plantae-tecnologies.github.io/plantae-filter/theme/bootstrap5-theme.css">
```

### 2. Customizing with `::part()`

Plantae Filter exposes parts for full customization:

```css
plantae-filter::part(badge) {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}

plantae-filter::part(dropdown-item) {
  padding: 0.5rem 1rem;
}

plantae-filter::part(dropdown-item selected) {
  background: #0d6efd;
  color: #fff;
}
```

Feel free to adapt styles to match your design system.

---

> Powered by Plantae Gestão Agrícola

---

