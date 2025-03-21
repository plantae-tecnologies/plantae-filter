# Plantae Filter

[![npm](https://img.shields.io/npm/v/@plantae-tech/plantae-filter?color=green)](https://www.npmjs.com/package/@plantae-tech/plantae-filter)
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

<select id="mySelect" data-pl-label="Products">
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
    label: "Products",
    allText: "All",
    emptyText: "Select options",
    groupSelectedLabel: "Selected",
    applyButtonText: "Apply",
    searchPlaceholder: "Search.."
});

// API Example
filter.addOption({ value: 'grape', text: 'Grape', group: 'Fruits' });
filter.selectOptions(['grape']);
```

### 3. Initializing `select` with custom element (example with UMD)

```html
<script src="https://plantae-tecnologies.github.io/plantae-filter/plantae-filter.umd.js"></script>

<plantae-filter label="Products" empty-text="Select..">
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

> Attributes must be informed in camelCase when informed by the class constructor.  
> The `data-pl-*` attributes are alternatives that can be used inside the `<select>` element if you prefer to configure it via the native `<select>`.  
> If both are provided, the values from `<plantae-filter>` will take priority.

| Attribute (no `<plantae-filter>`)       | Description                                | Example (`<plantae-filter>`)                                    | Example (`<select>`)                                           |
| --------------------------------------- | ------------------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------- |
| `label`                                 | Label shown on the filter                  | `label="Products"`                                              | `data-pl-label="Products"`                                     |
| `all-text`                              | Text when all items are selected           | `all-text="All"`                                                | `data-pl-all-text="All"`                                       |
| `empty-text`                            | Text when no item is selected              | `empty-text="Select"`                                           | `data-pl-empty-text="Select"`                                  |
| `group-selected-label`                  | Label shown on the "Selected" group        | `group-selected-label="Selected"`                               | `data-pl-group-selected-label="Selected"`                      |
| `apply-button-text`                     | Label shown on the apply button            | `apply-button-text="Apply"`                                     | `data-pl-apply-button-text="Apply"`                            |
| `search-placeholder`                    | Placeholder shown on the search input      | `search-placeholder="Search.."`                                 | `data-pl-search-placeholder="Search.."`                        |
| `search-debounce-delay`                 | Search engine response time                | `search-debounce-delay="100"`                                   | `data-pl-search-debounce-delay="100"`                          |
| `fuse-options`                          | JSON string with Fuse.js custom options    | `fuse-options='{"threshold": 0.2, "distance": 100}'`            | `data-pl-fuse-options='{"threshold": 0.2}'`                    |
| `clusterize-options`                    | JSON string with Clusterize.js options     | `clusterize-options='{"rows_in_block": 25}'`                    | `data-pl-clusterize-options='{"no_data_text": "No data"}'`     |

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

Plantae Filter exposes the following parts for styling via Shadow DOM `::part()` selectors:

| Part Name              | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| `filter`               | The clickable filter input area                         |
| `filter-text`          | The text container inside the filter area               |
| `clear-button`         | The clear (reset) button inside the filter              |
| `dropdown`             | The dropdown container with the options list            |
| `dropdown-item`        | A single option (`<li>`) inside the dropdown            |
| `dropdown-item selected` | A selected option inside the dropdown                |
| `dropdown-item focused`  | The item currently focused via keyboard navigation   |
| `highlight`            | The `<mark>` used to highlight search matches           |
| `optgroup`             | The group label (`<li>` separator) inside the dropdown  |
| `apply-button`         | The \"Apply\" button inside the dropdown footer         |
| `search-input`         | The search `<input>` inside the dropdown                |

### Example usage:

```css
plantae-filter::part(filter) {
    background: #f1f1f1;
    border-radius: 4px;
}

plantae-filter::part(dropdown-item focused) {
    ackground: #e0e0e0;
}

plantae-filter::part(highlight) {
    background: yellow;
}
```

Feel free to adapt styles to match your design system.

---

## Browser Support

Plantae Filter leverages modern browser APIs, including the use of **Web Workers** to offload the search functionality (powered by Fuse.js) to a separate thread, ensuring a smoother experience when filtering large datasets.

### Notes:
- The **Web Worker** is automatically used for all search operations.
- As of today, all modern browsers fully support Web Workers (Chrome, Firefox, Edge, Safari, etc.).
- **Internet Explorer** and very old browsers **do not support Web Workers** and are not compatible with this plugin.
- There is no fallback implementation if Web Workers are not available.

### Recommendation:
Ensure your application targets modern browsers or environments that provide full support for **Web Workers**.

---

> Powered by Plantae Gestão Agrícola

