declare interface InstanceAttributes {
    [key: string]: string;
}

declare interface OptionItem {
    value: OptionValue;
    text: string;
    group?: string | null;
    disabled?: boolean;
}

declare type OptionValue = string | number;

declare class PlantaeFilter {
    private component;
    private isReady;
    private queue;
    constructor(select: HTMLSelectElement, attributes?: InstanceAttributes);
    private flushQueue;
    private runOrQueue;
    private getDatasetAttributes;
    addOption(option: Parameters<PlantaeFilterElement['addOption']>[0]): void;
    addOptions(options: Parameters<PlantaeFilterElement['addOptions']>[0]): void;
    selectOptions(values: Parameters<PlantaeFilterElement['selectOptions']>[0]): void;
    removeOptions(values: Parameters<PlantaeFilterElement['removeOptions']>[0]): void;
    removeAllOptions(): void;
    clearSelection(): void;
    disableOptions(values: string[]): void;
    enableOptions(values: string[]): void;
    getSelected(): ReturnType<PlantaeFilterElement['getSelected']>;
    getAllOptions(): ReturnType<PlantaeFilterElement['getAllOptions']>;
}
export default PlantaeFilter;

declare class PlantaeFilterElement extends HTMLElement {
    private options;
    private optionMap;
    private selectedValues;
    private pendingValues;
    private fuse;
    private clusterize;
    private cursorIndex;
    private searchInput;
    private applyButton;
    private clearButton;
    private dropdown;
    private filterText;
    private filter;
    private scrollArea;
    private contentArea;
    private config;
    constructor();
    connectedCallback(): void;
    private loadConfig;
    private extractOptions;
    private loadTemplate;
    private populateOptions;
    private updateFilter;
    private attachEvents;
    private toggleSelectOption;
    private handleOutsideClick;
    private handleKeyboardNavigation;
    private updateCursor;
    private handleSearch;
    private handleClickitem;
    private initFuse;
    private initClusterize;
    private syncSelectElement;
    private applySelection;
    private clearSelectionInterno;
    private toggleDropdown;
    private closeDropdown;
    private openDropdown;
    addOption(option: OptionItem): void;
    addOptions(options: OptionItem[]): void;
    selectOptions(values: OptionValue[]): void;
    removeOptions(values: OptionValue[]): void;
    removeAllOptions(): void;
    clearSelection(): void;
    disableOptions(values: OptionValue[]): void;
    enableOptions(values: OptionValue[]): void;
    getSelected(): OptionItem[];
    getAllOptions(): OptionItem[];
}

export { }
