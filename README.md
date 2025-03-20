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

<select id="mySelect" data-filter-label="Products">
    <optgroup label="Fruits">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
    </optgroup>
    <option value="other">Other</option>
</select>

<script>
    const select = document.getElementById('mySelect');
    const pf = new PlantaeFilter(select);

    // API Example
    pf.addOption({ value: 'grape', text: 'Grape', group: 'Fruits' });
    pf.selectOptions(['grape']);
</script>
```

### 2. Using with Bundler (Vite, Webpack, Rollup)

```typescript
import PlantaeFilter from '@plantae-tech/plantae-filter';

const select = document.querySelector('select');
const filter = new PlantaeFilter(select, {
    "filter-label": "Products",
    "filter-all-text": "All",
    "filter-empty-text": "Select options",
    "filter-group-selected-label": "Selected",
    "filter-apply-button-text": "Apply",
    "filter-search-placeholder": "Search.."
});

// API Example
filter.addOption({ value: 'grape', text: 'Grape', group: 'Fruits' });
filter.selectOptions(['grape']);
```

### 3. Initializing `select` with custom element (example with UMD)

```html
<script src="https://plantae-tecnologies.github.io/plantae-filter/plantae-filter.umd.js"></script>

<plantae-filter filter-label="Products" filter-empty-text="Select..">
    <select id="mySelect">
        <optgroup label="Fruits">
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
        </optgroup>
        <option value="other">Other</option>
    </select>
</plantae-filter>

<script>
    const pf = document.querySelector('plantae-filter');

    // API Example
    pf.addOption({ value: 'grape', text: 'Grape', group: 'Fruits' });
    pf.selectOptions(['grape']);
</script>
```

---

## Data Attributes

> The `filter-*` attributes should be used directly on the `<plantae-filter>` component.  
> The `data-*` attributes are alternatives that can be used inside the `<select>` element if you prefer to configure it via the native `<select>`.  
> If both are provided, the values from `<plantae-filter>` will take priority.

| Attribute (no `<plantae-filter>`)       | Description                                | Example (`<plantae-filter>`)                                    | Example (`<select>`)                                           |
| --------------------------------------- | ------------------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------- |
| `filter-label`                          | Label shown on the filter                  | `filter-label="Products"`                                      | `data-filter-label="Products"`                                |
| `filter-all-text`                       | Text when all items are selected           | `filter-all-text="All"`                                        | `data-filter-all-text="All"`                                  |
| `filter-empty-text`                     | Text when no item is selected              | `filter-empty-text="Select"`                                   | `data-filter-empty-text="Select"`                             |
| `filter-group-selected-label`           | Label shown on the "Selected" group        | `filter-group-selected-label="Selected"`                       | `data-filter-group-selected-label="Selected"`                 |
| `filter-apply-button-text`              | Label shown on the apply button            | `filter-apply-button-text="Apply"`                             | `data-filter-apply-button-text="Apply"`                       |
| `filter-search-placeholder`             | Placeholder shown on the search input      | `filter-search-placeholder="Search.."`                         | `data-filter-search-placeholder="Search.."`                   |
| `filter-fuse-options`                   | JSON string with Fuse.js custom options    | `filter-fuse-options='{"threshold": 0.2, "distance": 100}'`    | `data-filter-fuse-options='{"threshold": 0.2}'`               |
| `filter-clusterize-options`             | JSON string with Clusterize.js options     | `filter-clusterize-options='{"rows_in_block": 25}'`            | `data-filter-clusterize-options='{"no_data_text": "No data"}'` |

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

