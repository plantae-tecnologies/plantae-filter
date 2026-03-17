import PlantaeFilterElement from './components/plantae-filter-element';
import { PlantaeFilter } from './components/plantae-filter';

// Registra o custom element
if (!customElements.get('plantae-filter')) {
    customElements.define('plantae-filter', PlantaeFilterElement);
}

export type { DataSourceConfig, DataSourcePage } from './types/data-source';
export default PlantaeFilter;