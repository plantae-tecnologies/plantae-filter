import PlantaeFilterElement from './components/plantae-filter-element';
import { PlantaeFilter } from './components/plantae-filter';

// Registra o custom element
if (!customElements.get('plantae-filter')) {
    customElements.define('plantae-filter', PlantaeFilterElement);
}

// Exporta ambos: a classe do Custom Element e a API amigável
export {
    PlantaeFilterElement,
    PlantaeFilter
};