# Plantae Filter

> Web Component e Controller JS para filtros multi-seleção com busca otimizada.

---

## 📦 Instalação

```bash
npm install plantae-filter
```

ou

```bash
yarn add plantae-filter
```

---

## 🚀 Uso básico

### 1️⃣ Usando com Controller (JS puro)

```ts
import { PlantaeFilter } from 'plantae-filter';

const select = document.querySelector('select');
const pf = new PlantaeFilter(select, { label: 'Produtos' });
```

### 2️⃣ Usando direto via Web Component

```ts
import 'plantae-filter'; // já registra automaticamente
```

### HTML

```html
<plantae-filter label="Categorias">
    <select multiple>
        <optgroup label="Frutas">
            <option value="maçã">Maçã</option>
            <option value="banana">Banana</option>
        </optgroup>
        <optgroup label="Legumes">
            <option value="cenoura">Cenoura</option>
            <option value="batata">Batata</option>
        </optgroup>
    </select>
</plantae-filter>
```

---

## 🔧 API pública disponível (`PlantaeFilter`)

| Método                                  | Descrição                                  |
| --------------------------------------- | ------------------------------------------ |
| `addOption(option)`                     | Adiciona uma opção individual.             |
| `addOptions(options[])`                 | Adiciona várias opções em lote.            |
| `removeOptions(values[])`               | Remove múltiplas opções pelo value.        |
| `removeAllOptions()`                    | Remove todas as opções e limpa seleção.    |
| `selectOptions(values[])`               | Seleciona opções programaticamente.        |
| `clearSelection()`                      | Limpa todas as opções selecionadas.        |
| `setOptionDisabled(values[], disabled)` | Desabilita ou habilita opções visualmente. |
| `getSelected()`                         | Retorna as opções atualmente selecionadas. |
| `getAllOptions()`                       | Retorna todas as opções disponíveis.       |

---

## 🎨 Estilos

- Estilização baseada em CSS Shadow DOM.
- Personalização via `::part()` nos elementos `dropdown-item` e `optgroup`.
- Temas alternativos em `/theme` importáveis via:

```ts
// é necessário importar o bootstrap5 no projeto para usar esse tema
import 'plantae-filter/theme/bootstrap5-theme.css';
```

---

## ✨ Recursos internos

- Busca otimizada com `Fuse.js`
- Renderização virtualizada com `Clusterize.js`
- Suporte a `<optgroup>`
- Multi-seleção e "Selecionados no topo"

---

## 🌐 Uso via CDN (Vanilla)

```html
<script src="https://plantae-tecnologies.github.io/plantae-filter/dist/plantae-filter.umd.js"></script>
<link rel="stylesheet" href="https://plantae-tecnologies.github.io/plantae-filter/dist/theme/default.css">
<script>
  const pf = new PlantaeFilter(document.querySelector('select'), { label: 'Categorias' });
</script>
```

Exemplo real usando o GitHub Pages:

```html
<script src="https://plantae-tecnologies.github.io/plantae-filter/dist/plantae-filter.umd.js"></script>
```
