import PlantaeFilterElement from './plantae-filter-element';

interface InstanceAttributes {
    [key: string]: string;
}

export class PlantaeFilter {
    private component: PlantaeFilterElement;

    constructor(select: HTMLSelectElement, attributes: InstanceAttributes = {}) {
        const wrapper = document.createElement('plantae-filter') as PlantaeFilterElement;

        // Pega atributos `data-pl-*` direto do <select>
        const datasetAttributes = this.getDatasetAttributes(select);

        // Junta com atributos passados via parâmetro
        const mergedAttributes = { ...datasetAttributes, ...attributes };

        // Aplica no custom element
        Object.entries(mergedAttributes).forEach(([key, value]) => {
            wrapper.setAttribute(key, value);
        });

        // Primeiro adiciona o wrapper antes do <select> no DOM
        select.parentNode?.insertBefore(wrapper, select);

        // Depois move o <select> para dentro do custom element
        wrapper.appendChild(select);

        this.component = wrapper;
    }

    private getDatasetAttributes(select: HTMLSelectElement): InstanceAttributes {
        const attrs: InstanceAttributes = {};
        Array.from(select.attributes).forEach(attr => {
            if (attr.name.startsWith('data-pl-')) {
                const key = attr.name.replace('data-pl-', '');
                attrs[key] = attr.value;
            }
        });
        return attrs;
    }

    // Expondo métodos do componente
    public addOption(option: Parameters<PlantaeFilterElement['addOption']>[0]): void {
        this.component.addOption(option);
    }

    public addOptions(options: Parameters<PlantaeFilterElement['addOptions']>[0]): void {
        this.component.addOptions(options);
    }

    public selectOptions(values: Parameters<PlantaeFilterElement['selectOptions']>[0]): void {
        this.component.selectOptions(values);
    }

    public removeOptions(values: Parameters<PlantaeFilterElement['removeOptions']>[0]): void {
        this.component.removeOptions(values);
    }

    public removeAllOptions(): void {
        this.component.removeAllOptions();
    }

    public clearSelection(): void {
        this.component.clearSelection();
    }

    public getSelected(): ReturnType<PlantaeFilterElement['getSelected']> {
        return this.component.getSelected();
    }

    public getAllOptions(): ReturnType<PlantaeFilterElement['getAllOptions']> {
        return this.component.getAllOptions();
    }

    public setOptionDisabled(values: string[], disabled: boolean): void {
        this.component.setOptionDisabled(values, disabled);
    }
}