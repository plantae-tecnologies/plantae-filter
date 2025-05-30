import type { PlantaeFilter } from '../components/plantae-filter';

declare global {
    interface HTMLElement {
        plantaeFilter?: PlantaeFilter;
    }
}
