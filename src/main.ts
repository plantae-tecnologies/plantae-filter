import PlantaeFilterElement from './components/plantae-filter-element';
import { PlantaeFilter } from './components/plantae-filter';
import { RemoteDataSource } from './components/data-source/remote-data-source';
export type { DataSourceConfig, DataSourcePage } from './types/data-source';

// Registra o custom element
if (!customElements.get('plantae-filter')) {
    customElements.define('plantae-filter', PlantaeFilterElement);
}

export { RemoteDataSource };
export default PlantaeFilter;