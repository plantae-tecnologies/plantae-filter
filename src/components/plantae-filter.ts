import PlantaeFilterElement from './plantae-filter-element';

interface InstanceAttributes {
    [key: string]: string;
}

export class PlantaeFilter {
    private component: PlantaeFilterElement;
    private isReady = false;
    private queue: (() => void)[] = [];

    constructor(select: HTMLSelectElement, attributes: InstanceAttributes = {}) {
        const wrapper = document.createElement('plantae-filter') as PlantaeFilterElement;

        // Pega atributos `data-pl-*` direto do <select>
        const datasetAttributes = this.getDatasetAttributes(select);
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

        // Seta a flag quando o custom element terminar de carregar
        wrapper.addEventListener('plantae-filter-ready', () => {
            this.isReady = true;
            this.flushQueue();
        });
    }

    private flushQueue(): void {
        this.queue.forEach(fn => fn());
        this.queue = [];
    }

    private runOrQueue(fn: () => void): void {
        if (this.isReady) {
            fn();
        } else {
            this.queue.push(fn);
        }
    }

    private getDatasetAttributes(select: HTMLSelectElement): InstanceAttributes {
        const attrs: InstanceAttributes = {};
        Array.from(select.attributes).forEach(attr => {
            if (attr.name.startsWith('data-')) {
                const key = attr.name.replace('data-', '');
                attrs[key] = attr.value;
            }
        });
        return attrs;
    }

    // Expondo métodos do componente
    public addOption(option: Parameters<PlantaeFilterElement['addOption']>[0]): void {
        this.runOrQueue(() => this.component.addOption(option));
    }

    public addOptions(options: Parameters<PlantaeFilterElement['addOptions']>[0]): void {
        this.runOrQueue(() => this.component.addOptions(options));
    }

    public selectOptions(values: Parameters<PlantaeFilterElement['selectOptions']>[0]): void {
        this.runOrQueue(() => this.component.selectOptions(values));
    }

    public removeOptions(values: Parameters<PlantaeFilterElement['removeOptions']>[0]): void {
        this.runOrQueue(() => this.component.removeOptions(values));
    }

    public removeAllOptions(): void {
        this.runOrQueue(() => this.component.removeAllOptions());
    }

    public clearSelection(): void {
        this.runOrQueue(() => this.component.clearSelection());
    }

    public disableOptions(values: string[]): void {
        this.runOrQueue(() => this.component.disableOptions(values));
    }

    public enableOptions(values: string[]): void {
        this.runOrQueue(() => this.component.enableOptions(values));
    }

    public getSelected(): ReturnType<PlantaeFilterElement['getSelected']> {
        return this.component.getSelected();
    }

    public getAllOptions(): ReturnType<PlantaeFilterElement['getAllOptions']> {
        return this.component.getAllOptions();
    }
}