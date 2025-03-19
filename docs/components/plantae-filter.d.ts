import { default as PlantaeFilterElement } from './plantae-filter-element';
interface InstanceAttributes {
    [key: string]: string;
}
export declare class PlantaeFilter {
    private component;
    constructor(select: HTMLSelectElement, attributes?: InstanceAttributes);
    addOption(option: Parameters<PlantaeFilterElement['addOption']>[0]): void;
    addOptions(options: Parameters<PlantaeFilterElement['addOptions']>[0]): void;
    selectOptions(values: Parameters<PlantaeFilterElement['selectOptions']>[0]): void;
    removeOptions(values: Parameters<PlantaeFilterElement['removeOptions']>[0]): void;
    removeAllOptions(): void;
    clearSelection(): void;
    getSelected(): ReturnType<PlantaeFilterElement['getSelected']>;
    getAllOptions(): ReturnType<PlantaeFilterElement['getAllOptions']>;
    setOptionDisabled(values: string[], disabled: boolean): void;
}
export {};
