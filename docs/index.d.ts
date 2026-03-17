import { ClusterizeOptions } from 'clusterize.js';
import { default as default_2 } from 'clusterize.js';
import { FuseResult } from 'fuse.js';
import { IFuseOptions } from 'fuse.js';

/** Configuração do DataSource remoto */
export declare interface DataSourceConfig {
    /** URL base da API */
    url: string;
    /** Método HTTP (default: GET) */
    method?: 'GET' | 'POST';
    /** Headers customizados (ex: Authorization) */
    headers?: Record<string, string>;
    /** Parâmetros estáticos de query string */
    params?: Record<string, string>;
    /** Tamanho da página / items por request (default: 50) */
    pageSize?: number;
    /**
     * Número de requests paralelos para buscar páginas simultaneamente.
     * Requer que mapResponse retorne totalItems e paginação numérica.
     * Default: 1 (sequencial).
     */
    concurrency?: number;
    /**
     * Função obrigatória que transforma a resposta da API
     * no formato padrão DataSourcePage.
     *
     * Recebe o JSON da resposta e o cursor atual (undefined na 1ª página).
     */
    mapResponse: (responseBody: any, currentCursor?: string | number) => DataSourcePage;
    /**
     * Função opcional para construir os parâmetros de paginação.
     * Recebe o cursor e pageSize, retorna Record que será mergeado nos params.
     * Default: { page: cursor ?? 1, per_page: pageSize }
     */
    buildPageParams?: (cursor: string | number | undefined, pageSize: number) => Record<string, string>;
    /**
     * Callback chamado quando todas as páginas foram carregadas com sucesso.
     */
    onComplete?: () => void;
    /**
     * Callback chamado quando ocorre um erro durante o carregamento.
     */
    onError?: (error: Error) => void;
    /**
     * Callback chamado quando o estado de loading muda.
     */
    onLoadingChange?: (isLoading: boolean) => void;
}

/**
 * Resultado padronizado de uma página de dados.
 *
 * Duas formas:
 * - `hasMore`: paginação por cursor (total desconhecido)
 * - `totalItems`: paginação por total conhecido — habilita fetch paralelo com `concurrency > 1`
 */
export declare type DataSourcePage = {
    items: OptionItem[];
} & ({
    nextCursor?: string | number;
    hasMore: boolean; /** Cursor flexível: pode ser número de página, offset, cursor string, etc. */
} | {
    totalItems: number;
});

declare interface InstanceAttributes {
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
    render?: (item: OptionItemRender) => string;
    dataSource?: DataSourceConfig;
}

declare interface OptionItem {
    value: OptionValue;
    text: string;
    group?: string | null;
    disabled?: boolean;
    data?: Record<string, any>;
}

declare type OptionItemRender = OptionItem & {
    selected?: boolean;
};

declare type OptionValue = string | number;

declare class PlantaeFilter {
    component: PlantaeFilterElement;
    select: HTMLSelectElement;
    private isReady;
    private queue;
    constructor(select: HTMLSelectElement, attributes?: InstanceAttributes);
    private flushQueue;
    private runOrQueue;
    private getDatasetAttributes;
    addOption(option: Parameters<PlantaeFilterElement['addOption']>[0]): void;
    addOptions(options: Parameters<PlantaeFilterElement['addOptions']>[0]): void;
    selectOptions(values: Parameters<PlantaeFilterElement['selectOptions']>[0]): void;
    deselectOptions(values: Parameters<PlantaeFilterElement['deselectOptions']>[0]): void;
    removeOptions(values: Parameters<PlantaeFilterElement['removeOptions']>[0]): void;
    removeAllOptions(): void;
    clearSelection(): void;
    disableOptions(values: string[]): void;
    enableOptions(values: string[]): void;
    setValue(values: Parameters<PlantaeFilterElement['setValue']>[0]): void;
    getValue(): ReturnType<PlantaeFilterElement['getValue']>;
    getSelected(): ReturnType<PlantaeFilterElement['getSelected']>;
    getAllOptions(): ReturnType<PlantaeFilterElement['getAllOptions']>;
    setDataSource(config: DataSourceConfig): void;
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
    private updateOptionsDebounced;
    protected customRenderFn?: (item: OptionItemRender) => string;
    private remoteDataSource?;
    private searchEngine;
    protected loadingIndicator: HTMLElement;
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
        searchEngineMode: string;
        fuseOptions: IFuseOptions<OptionItem>;
        clusterizeOptions: Partial<ClusterizeOptions>;
    };
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected initDataSource(config: DataSourceConfig): void;
    protected loadConfig(): void;
    protected extractOptions(): Promise<void>;
    protected extractOptionItem(element: HTMLOptionElement, groupElement?: HTMLOptGroupElement): OptionItem;
    protected loadTemplate(): void;
    protected populateOptions(optionsToRender: OptionItem[] | Array<FuseResult<OptionItem>>): Promise<void>;
    private applyHighlightAllFields;
    protected defaultRender(item: OptionItemRender, content?: string): string;
    protected updateFilter(): void;
    protected attachEvents(): void;
    protected toggleSelectOption(li: HTMLElement, value: string): void;
    protected handleOutsideClick(event: Event): void;
    protected handleKeyboardNavigation(event: KeyboardEvent): void;
    protected updateCursor(lis: HTMLElement[]): void;
    protected handleSearch(): void;
    protected handleClickitem(event: Event): void;
    protected initSearchEngine(): void;
    private handleSearchResults;
    protected initClusterize(): void;
    protected syncSelectElement(): void;
    protected applySelection(): void;
    protected clear(event?: Event): void;
    protected toggleDropdown(): void;
    protected closeDropdown(): void;
    protected openDropdown(): void;
    private updateOptions;
    addOption(option: OptionItem): void;
    addOptions(options: OptionItem[]): void;
    selectOptions(values: OptionValue[]): void;
    deselectOptions(values: OptionValue[]): void;
    removeOptions(values: OptionValue[]): void;
    removeAllOptions(): void;
    clearSelection(): void;
    disableOptions(values: OptionValue[]): void;
    enableOptions(values: OptionValue[]): void;
    setValue(values: OptionValue[]): void;
    getValue(): string[];
    getSelected(): OptionItem[];
    getAllOptions(): OptionItem[];
    set customSearchEngine(engine: SearchEngine);
    /** Configura e inicia o carregamento de dados via DataSource remoto */
    setDataSource(config: DataSourceConfig): void;
}

declare interface SearchEngine {
    search(term: string, token: number): void;
    update(collection: OptionItem[]): void;
    onResults?: (results: FuseResult<OptionItem>[] | OptionItem[], token: number) => void;
}

export { }
