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

### 1. Using with UMD (CDN + Vanilla JS)

```html
<script src="https://plantae-tecnologies.github.io/plantae-filter/plantae-filter.umd.js"></script>

<select id="mySelect" data-options="inline" data-pl-label="Produtos">
  <optgroup label="Frutas">
    <option value="maca">Maçã</option>
    <option value="banana">Banana</option>
  </optgroup>
  <option value="outro">Outro</option>
</select>

<script>
  const select = document.getElementById('mySelect');
  const pf = new PlantaeFilter(select);

  // API Example
  pf.addOption({ value: 'uva', text: 'Uva', group: 'Frutas' });
  pf.selectOptions(['uva']);
</script>
```

### 2. Using with Bundler (Vite, Webpack, Rollup)

```typescript
import PlantaeFilter from '@plantae-tech/plantae-filter';

const select = document.querySelector('select');
const pf = new PlantaeFilter(select, { label: 'Produtos', all-text: 'Todos', empty-text: 'Selecione' });

// API Example
pf.addOption({ value: 'uva', text: 'Uva', group: 'Frutas' });
pf.selectOptions(['uva']);
```

### 3. Initializing `select` with custom element (exemple with UMD)

```html
<script src="https://plantae-tecnologies.github.io/plantae-filter/plantae-filter.umd.js"></script>

<plantae-filter label="Produtos" empty-text="Selecione..">
  <select id="mySelect">
    <optgroup label="Frutas">
      <option value="maca">Maçã</option>
      <option value="banana">Banana</option>
    </optgroup>
    <option value="outro">Outro</option>
  </select>
</plantae-filter>

<script>
  const pf = document.querySelector('plantae-filter');

  // API Example
  pf.addOption({ value: 'uva', text: 'Uva', group: 'Frutas' });
  pf.selectOptions(['uva']);
</script>
```

---

## Data Attributes

The following attributes can be set directly on the `<select>` element as `data-pl-*`:

| Attribute          | Description                      | Example                          |
| ------------------ | -------------------------------- | -------------------------------- |
| data-pl-label      | Label shown on the filter         | `data-pl-label="Produtos"`       |
| data-pl-all-text   | Text when all items are selected | `data-pl-all-text="Todos"`       |
| data-pl-empty-text | Text when no item is selected    | `data-pl-empty-text="Selecione"` |
| group-name-selecteds | Label shown on group the selecteds | `data-pl-group-name-selecteds="Selecionados"` |
| fuse-options | Text when no item is selected    | `data-pl-fuse-options="{"threshold": 0.2, "distance": 100}"` |
| clusterize-options | Text when no item is selected    | `data-pl-clusterize-options="{"rows_in_block": 25, "blocks_in_cluster": 5, "no_data_text": "Nada encontrado"}"` |

> They can also be specified in the custom element `plantae-filter` without the `data-pl-` prefix.

### Exemplo de uso no HTML

```html
<plantae-filter
    label="Produtos"
    all-text="Todos os produtos"
    empty-text="Escolha"
    fuse-options='{"threshold": 0.2, "distance": 100}'
    clusterize-options='{"rows_in_block": 25, "blocks_in_cluster": 5, "no_data_text": "Nada encontrado"}'
>
    <select>
        <!-- options -->
    </select>
</plantae-filter>

```
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
plantae-filter::part(filter) {
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

