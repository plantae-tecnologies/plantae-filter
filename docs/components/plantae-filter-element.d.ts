interface OptionItem {
    value: string;
    text: string;
    group: string | null;
}
interface NewOption {
    value: string;
    text: string;
    group?: string | null;
    disabled?: boolean;
}
declare class PlantaeFilterElement extends HTMLElement {
    private options;
    private selectedValues;
    private pendingValues;
    private fuse;
    private clusterize;
    constructor();
    connectedCallback(): void;
    private extractOptions;
    private loadTemplate;
    private populateOptions;
    private updateFilter;
    private attachEvents;
    private toggleSelectOption;
    private handleOutsideClick;
    private handleEscKey;
    private initSearch;
    private initClusterize;
    private syncSelectElement;
    private applySelection;
    private clearSelectionInterno;
    private toggleDropdown;
    private closeDropdown;
    private openDropdown;
    private syncPendingWithApplied;
    private isOptionDisabled;
    private setOptionsDisabled;
    addOption(option: NewOption): void;
    addOptions(options: NewOption[]): void;
    selectOptions(values: string[]): void;
    removeOptions(values: string[]): void;
    removeAllOptions(): void;
    clearSelection(): void;
    disableOptions(values: string[]): void;
    enableOptions(values: string[]): void;
    getSelected(): OptionItem[];
    getAllOptions(): OptionItem[];
}
export default PlantaeFilterElement;
