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
    private updateBadge;
    private attachEvents;
    private toggleSelectOption;
    private handleOutsideClick;
    private handleEscKey;
    private initSearch;
    private initClusterize;
    private syncSelectElement;
    private applySelection;
    private clearSelectionInterno;
    private closeDropdown;
    private openDropdown;
    private syncPendingWithApplied;
    private isOptionDisabled;
    addOption(option: NewOption): void;
    addOptions(options: NewOption[]): void;
    selectOptions(values: string[]): void;
    removeOptions(values: string[]): void;
    removeAllOptions(): void;
    clearSelection(): void;
    setOptionDisabled(values: string[], disabled: boolean): void;
    getSelected(): OptionItem[];
    getAllOptions(): OptionItem[];
}
export default PlantaeFilterElement;
