import PlantaeFilter from './components/plantae-filter';

// Registra automaticamente ao importar a lib
if (!customElements.get('plantae-filter')) {
    customElements.define('plantae-filter', PlantaeFilter);
}

export default PlantaeFilter;
