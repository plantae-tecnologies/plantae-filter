# Plantae Filter

> Componente Web Customizado para filtros multi-seleção com pesquisa otimizada.

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

### Importando via ES Modules

```ts
import 'plantae-filter';

// opcional, se preferir manualmente:
import PlantaeFilterElement from 'plantae-filter-element';
customElements.define('plantae-filter', PlantaeFilterElement);
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

## 🔧 API pública disponível

| Método                                  | Descrição                                  |
| --------------------------------------- | ------------------------------------------ |
| `addOption(option)`                     | Adiciona uma opção individual.             |
| `addOptions(options[])`                 | Adiciona várias opções em lote.            |
| `removeOptions(values[])`               | Remove múltiplas opções pelo value.        |
| `removeAllOptions()`                    | Remove todas as opções e limpa seleção.    |
| `selectOptions(values[])`               | Seleciona opções programaticamente.        |
| `clearSelectionAPI()`                   | Limpa todas as opções selecionadas.        |
| `setOptionDisabled(values[], disabled)` | Desabilita ou habilita opções visualmente. |
| `getSelected()`                         | Retorna as opções atualmente selecionadas. |
| `getAllOptions()`                       | Retorna todas as opções disponíveis.       |

---

## 🎨 Estilos

- Estilização baseada em CSS Shadow DOM.
- Aceita personalização via `::part()` nos elementos `dropdown-item` e `optgroup`.

---

## ✨ Recursos internos

- Busca otimizada com `Fuse.js`
- Renderização virtualizada com `Clusterize.js`
- Suporte a grupos (`optgroup`)
- Multi-seleção e "Selecionados no topo"
