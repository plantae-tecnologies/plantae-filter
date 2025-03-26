import { ClusterizeOptions } from 'clusterize.js';
import { default as default_2 } from 'clusterize.js';
import { FuseResult } from 'fuse.js';
import { FuseResultMatch } from 'fuse.js';
import { IFuseOptions } from 'fuse.js';

declare interface InstanceAttributes {
    label?: string;
    allText?: string;
    emptyText?: string;
    groupSelectedLabel?: string;
    applyButtonText?: string;
    searchPlaceholder?: string;
    searchDebounceDelay?: number;
    fuseOptions?: IFuseOptions<OptionItem>;
    clusterizeOptions?: Partial<ClusterizeOptions>;
    [key: string]: string | number | boolean | object | undefined;
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
    protected options: OptionItem[];
    protected optionMap: Map<string | number, OptionItem>;
    protected selectedValues: Set<string>;
    protected pendingValues: Set<string>;
    protected clusterize: default_2;
    protected cursorIndex: number;
    protected searchToken: number;
    protected searchWorker: Worker;
    protected loadingIndicator: HTMLElement;
    protected selectElement: HTMLSelectElement;
    protected searchInput: HTMLInputElement;
    protected applyButton: HTMLElement;
    protected clearButton: HTMLElement;
    protected dropdown: HTMLElement;
    protected filterText: HTMLElement;
    protected filter: HTMLElement;
    protected scrollArea: HTMLElement;
    protected contentArea: HTMLElement;
    protected config: {
        label: string;
        allText: string;
        emptyText: string;
        applyButtonText: string;
        groupSelectedLabel: string;
        searchPlaceholder: string;
        searchDebounceDelay: number;
        fuseOptions: IFuseOptions<OptionItem>;
        clusterizeOptions: Partial<ClusterizeOptions>;
    };
    connectedCallback(): void;
    protected loadConfig(): void;
    protected extractOptions(): Promise<void>;
    protected loadTemplate(): void;
    protected populateOptions(optionsToRender: OptionItem[] | Array<FuseResult<OptionItem>>): Promise<void>;
    protected formatTextWithHighlight(text: string, matches?: readonly FuseResultMatch[]): string;
    protected updateFilter(): void;
    protected attachEvents(): void;
    protected toggleSelectOption(li: HTMLElement, value: string): void;
    protected handleOutsideClick(event: Event): void;
    protected handleKeyboardNavigation(event: KeyboardEvent): void;
    protected updateCursor(lis: HTMLElement[]): void;
    protected handleSearch(): void;
    protected handleClickitem(event: Event): void;
    protected initFuseWorker(): void;
    protected initClusterize(): void;
    protected syncSelectElement(): void;
    protected applySelection(): void;
    protected clear(event?: Event): void;
    protected toggleDropdown(): void;
    protected closeDropdown(): void;
    protected openDropdown(): void;
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
