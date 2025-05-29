import PlantaeFilterElement from './plantae-filter-element';
import { camelToKebab } from '../helpers/utils';
import type { OptionItem } from './plantae-filter-element';
import type { IFuseOptions } from 'fuse.js';
import type { ClusterizeOptions } from 'clusterize.js';

interface InstanceAttributes {
    label?: string;
    allText?: string;
    emptyText?: string;
    groupSelectedLabel?: string;
    applyButtonText?: string;
    searchPlaceholder?: string;
    searchDebounceDelay?: number;
    searchEngineMode?: 'fuse' | 'fuse-worker';
    fuseOptions?: IFuseOptions<OptionItem>;
    clusterizeOptions?: Partial<ClusterizeOptions>;
    [key: string]: string | number | boolean | object | undefined;
}

export class PlantaeFilter {
    public component: PlantaeFilterElement;
    public select: HTMLSelectElement;
    private isReady = false;
    private queue: (() => void)[] = [];

    constructor(select: HTMLSelectElement, attributes: InstanceAttributes = {}) {
        const wrapper = document.createElement('plantae-filter') as PlantaeFilterElement;

        // Pega atributos `data-pl-*` direto do <select>
        const datasetAttributes = this.getDatasetAttributes(select, 'data-pl-');
        const mergedAttributes = { ...datasetAttributes, ...attributes };

        // Aplica no custom element
        Object.entries(mergedAttributes).forEach(([key, value]) => {
            wrapper.setAttribute(camelToKebab(key), typeof value === 'string' ? value : JSON.stringify(value));
        });

        // Primeiro adiciona o wrapper antes do <select> no DOM
        select.parentNode?.insertBefore(wrapper, select);

        // Depois move o <select> para dentro do custom element
        wrapper.appendChild(select);

        this.component = wrapper;
        this.select = select;

        this.component.plantaeFilter = this;
        this.select.plantaeFilter = this;

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

    private getDatasetAttributes(select: HTMLSelectElement, prefix: string = ''): InstanceAttributes {
        const attrs: InstanceAttributes = {};
        Array.from(select.attributes).forEach(attr => {
            if (attr.name.startsWith(prefix)) {
                const key = attr.name.replace(prefix, '');
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

    public deselectOptions(values: Parameters<PlantaeFilterElement['deselectOptions']>[0]): void {
        this.runOrQueue(() => this.component.deselectOptions(values));
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

    public setValue(values: Parameters<PlantaeFilterElement['setValue']>[0]): void {
        this.runOrQueue(() => this.component.setValue(values));
    }

    public getValue(): ReturnType<PlantaeFilterElement['getValue']> {
        return this.component.getValue();
    }

    public getSelected(): ReturnType<PlantaeFilterElement['getSelected']> {
        return this.component.getSelected();
    }

    public getAllOptions(): ReturnType<PlantaeFilterElement['getAllOptions']> {
        return this.component.getAllOptions();
    }
}