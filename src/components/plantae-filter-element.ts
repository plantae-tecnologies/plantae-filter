import templateHtml from './plantae-filter.html?raw';
import styles from './plantae-filter.css?inline';
import { debounce, mergeOverlapping, attributesToCamelCase } from '../helpers/utils';
import type { IFuseOptions, FuseResult, FuseResultMatch } from 'fuse.js';
import Clusterize from 'clusterize.js';
import type { ClusterizeOptions } from 'clusterize.js';
import { SearchEngine } from './search-engine/search-engine.interface';
import WorkerSearchEngine from './search-engine/worker-search-engine';
import FuseSearchEngine from './search-engine/fuse-search-engine';

type OptionValue = string | number;

interface OptionItem {
    value: OptionValue;
    text: string;
    group?: string | null;
    disabled?: boolean;
    data?: Record<string, any>;
}

type OptionItemRender = OptionItem & {
    selected?: boolean;
}

class PlantaeFilterElement extends HTMLElement {

    protected options: OptionItem[] = [];
    protected optionMap: Map<string | number, OptionItem> = new Map();
    protected selectedValues: Set<string> = new Set();
    protected pendingValues: Set<string> = new Set();
    protected clusterize!: Clusterize;
    protected cursorIndex: number = -1;
    protected searchToken = 0;
    private updateOptionsDebounced!: () => void;

    protected customRenderFn?: (item: OptionItemRender) => string;

    private searchEngine!: SearchEngine;
    protected loadingIndicator!: HTMLElement;

    protected searchInput!: HTMLInputElement;
    protected applyButton!: HTMLElement;
    protected clearButton!: HTMLElement;
    protected dropdown!: HTMLElement;
    protected filterText!: HTMLElement;
    protected filter!: HTMLElement;
    protected scrollArea!: HTMLElement;
    protected contentArea!: HTMLElement;

    protected config = {
        label: 'Filtro',
        allText: 'Todos',
        emptyText: 'Selecione',
        applyButtonText: 'Aplicar',
        groupSelectedLabel: 'Selecionados',
        searchPlaceholder: 'Buscar..',
        searchDebounceDelay: 100,
        searchEngineMode: 'fuse',
        fuseOptions: {
            keys: ['text', 'value'],
            threshold: 0.3,
            ignoreDiacritics: true,
            useExtendedSearch: true,
            ignoreLocation: true,
            includeScore: true,
            includeMatches: true
        } as IFuseOptions<OptionItem>,
        clusterizeOptions: {
            tag: 'ul',
            no_data_text: "Não encontrado"
        } as Partial<ClusterizeOptions>
    };

    connectedCallback(): void {
        this.customRenderFn = (this as any)._customRenderFn;

        this.updateOptionsDebounced = debounce(() => this.updateOptions(), 20);

        this.loadConfig();
        this.loadTemplate();
        requestAnimationFrame(() => {
            this.extractOptions();
            this.attachEvents();
            this.initSearchEngine();
            this.initClusterize();
            this.populateOptions(this.options);
            this.syncSelectElement();
            this.updateFilter();

            this.dispatchEvent(new CustomEvent('plantae-filter-ready', { bubbles: false }));
        });
    }

    protected loadConfig(): void {
        const componentAttributes = attributesToCamelCase(this);

        this.config.label = componentAttributes.label || this.config.label;
        this.config.allText = componentAttributes.allText || this.config.allText;
        this.config.emptyText = componentAttributes.emptyText || this.config.emptyText;
        this.config.groupSelectedLabel = componentAttributes.groupSelectedLabel || this.config.groupSelectedLabel;
        this.config.applyButtonText = componentAttributes.applyButtonText || this.config.applyButtonText;
        this.config.searchPlaceholder = componentAttributes.searchPlaceholder || this.config.searchPlaceholder;
        this.config.searchDebounceDelay = Number(componentAttributes.searchDebounceDelay) || this.config.searchDebounceDelay;
        this.config.searchEngineMode = componentAttributes.searchEngineMode || this.config.searchEngineMode;

        const fuseAttr = componentAttributes.fuseOptions;
        if (fuseAttr) {
            try {
                const parsed = JSON.parse(fuseAttr);
                this.config.fuseOptions = { ...this.config.fuseOptions, ...parsed };
            } catch (err) {
                console.warn("Invalid JSON for fuseOptions", err);
            }
        }

        const clusterizeAttr = componentAttributes.clusterizeOptions;
        if (clusterizeAttr) {
            try {
                const parsed = JSON.parse(clusterizeAttr);
                this.config.clusterizeOptions = { ...this.config.clusterizeOptions, ...parsed };
            } catch (err) {
                console.warn("Invalid JSON for clusterizeOptions", err);
            }
        }
    }

    protected async extractOptions(): Promise<void> {
        const selectElement = this.querySelector("select");
        if (!selectElement) return;

        const flatOptions: OptionItem[] = [];
        const children = Array.from(selectElement.children);
        let batchCount = 0;

        for (const child of children) {
            if (child instanceof HTMLOptGroupElement) {
                for (const option of Array.from(child.children)) {
                    if (option instanceof HTMLOptionElement) {
                        const opt = this.extractOptionItem(option, child);
                        this.optionMap.set(opt.value, opt);
                        flatOptions.push(opt);
                    }
                }
            } else if (child instanceof HTMLOptionElement) {
                const opt = this.extractOptionItem(child);
                this.optionMap.set(opt.value, opt);
                flatOptions.push(opt);
            }

            batchCount++;
            if (batchCount % 200 === 0) {
                await new Promise(requestAnimationFrame);
            }
        }

        this.options = flatOptions;
        selectElement.style.display = "none";
    }

    protected extractOptionItem(element: HTMLOptionElement, groupElement?: HTMLOptGroupElement): OptionItem {
        const dataAttrs = Array.from(element.attributes)
            .filter(attr => attr.name.startsWith('data-') && !attr.name.startsWith('data-pl-'))
            .reduce((acc, attr) => {
                const key = attr.name.replace(/^data-/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
                acc[key] = attr.value;
                return acc;
            }, {} as Record<string, any>);
            
        return {
            value: String(element.value),
            text: element.text,
            group: groupElement instanceof HTMLOptGroupElement ? groupElement.label : null,
            disabled: element.disabled,
            data: dataAttrs
        } as OptionItem;
    }

    protected loadTemplate(): void {
        const template = document.createElement('template');
        template.innerHTML = `<style>${styles}</style>${templateHtml}`;
        this.attachShadow({ mode: 'open' })!.append(template.content.cloneNode(true));

        this.searchInput = this.shadowRoot!.getElementById("searchInput") as HTMLInputElement;
        this.applyButton = this.shadowRoot!.getElementById("applyButton")!;
        this.clearButton = this.shadowRoot!.getElementById("clearButton")!;
        this.dropdown = this.shadowRoot!.getElementById("dropdown")!;
        this.filterText = this.shadowRoot!.getElementById("filterText")!;
        this.filter = this.shadowRoot!.getElementById("filter")!;
        this.scrollArea = this.shadowRoot!.getElementById("scrollArea")!;
        this.contentArea = this.shadowRoot!.getElementById("contentArea")!;
        this.loadingIndicator = this.shadowRoot!.getElementById("loadingIndicator")!;

        this.searchInput.placeholder = this.config.searchPlaceholder;
        this.applyButton.innerText = this.config.applyButtonText;
    }

    protected async populateOptions(optionsToRender: OptionItem[] | Array<FuseResult<OptionItem>>): Promise<void> {
        let rows: string[] = [];
        const selectedRows: string[] = [];
        const groupedRows: Map<string | null, string[]> = new Map();
        const isSearching = this.searchInput.value.trim();

        for (const opt of optionsToRender) {
            const { item, matches } = 'item' in opt ? { item: opt.item, matches: opt.matches } : { item: opt, matches: undefined };
            const valueStr = String(item.value);

            const highlightedItem: OptionItemRender = isSearching ? this.applyHighlightAllFields(item, matches) : item;
            highlightedItem.selected = this.pendingValues.has(valueStr);

            const li = this.customRenderFn
                ? this.defaultRender(highlightedItem, this.customRenderFn(highlightedItem))
                : this.defaultRender(highlightedItem);

            if (highlightedItem.selected) {
                selectedRows.push(li);
            } else {
                const groupKey = item.group || null;
                if (!groupedRows.has(groupKey)) {
                    groupedRows.set(groupKey, []);
                }
                groupedRows.get(groupKey)!.push(li);
            }
        }

        if (selectedRows.length > 0) {
            rows.push(`<li class="optgroup">${this.config.groupSelectedLabel} (${selectedRows.length})</li>`);
            rows = rows.concat(selectedRows);
            rows.push(`<li class="optgroup"></li>`);
        }

        if (isSearching) {
            groupedRows.forEach(items => {
                rows = rows.concat(items);
            });
        } else {
            groupedRows.forEach((items, group) => {
                if (group) rows.push(`<li class="optgroup">${group}</li>`);
                rows = rows.concat(items);
            });
        }

        this.clusterize.clear();
        this.clusterize.update(rows);
    }

    private applyHighlightAllFields(item: OptionItem, matches?: readonly FuseResultMatch[]): OptionItem {
        if (!matches?.length) return item;

        const clone: OptionItem = {
            ...item,
            data: { ...item.data }
        };

        for (const match of matches) {
            const path = match!.key!.split('.');
            let target: any = clone;

            for (let i = 0; i < path.length - 1; i++) {
                target = target?.[path[i]];
            }

            const finalKey = path[path.length - 1];
            const original = target?.[finalKey];

            if (typeof original === 'string') {
                const indices = mergeOverlapping(match.indices);
                let result = '';
                let lastIndex = 0;

                for (const [start, end] of indices) {
                    result += original.slice(lastIndex, start);
                    result += `<mark part="highlight">${original.slice(start, end + 1)}</mark>`;
                    lastIndex = end + 1;
                }

                result += original.slice(lastIndex);
                target[finalKey] = result;
            }
        }

        return clone;
    }

    protected defaultRender(item: OptionItemRender, content?: string): string {
        const classStack = [];
        if (item.selected) classStack.push('selected');
        if (item.disabled) classStack.push('disabled');
        const classes = classStack.join(' ');

        content = content ?? item.text;

        return `<li part="dropdown-item${classes ? ` ${classes}` : ''}" class="${classes}" data-value="${item.value}" ${item.disabled ? 'aria-disabled="true"' : ''}>${content}</li>`;
    }

    protected updateFilter(): void {
        const total = this.options.length;
        const count = this.selectedValues.size;

        const selectedTexts = [...this.selectedValues]
            .map(v => this.optionMap.get(v)!.text);

        this.filterText.innerHTML = count
            ? `<span part='counter-filter' class='counter-filter'>${count}</span> <strong>${this.config.label}:</strong> ${count === total ? this.config.allText : selectedTexts.join(", ")}`
            : `<strong>${this.config.label}:</strong> ${this.config.emptyText}`;

        this.clearButton.style.opacity = count ? '1' : '0.5';
        this.clearButton.style.pointerEvents = count ? 'auto' : 'none';

        this.filter.setAttribute("title", count ? selectedTexts.join(", ") : '');
    }

    // === EVENT HANDLERS ===

    protected attachEvents(): void {
        this.filter.addEventListener("click", () => this.toggleDropdown());
        this.clearButton.addEventListener("click", (e) => this.clear(e));
        this.applyButton.addEventListener("click", () => this.applySelection());
        this.searchInput.addEventListener("input", debounce(this.handleSearch.bind(this), this.config.searchDebounceDelay));
        this.contentArea.addEventListener('click', this.handleClickitem.bind(this));

        document.addEventListener("keydown", (e: KeyboardEvent) => this.handleKeyboardNavigation(e));
        document.addEventListener("click", (e) => this.handleOutsideClick(e));
    }

    protected toggleSelectOption(li: HTMLElement, value: string): void {
        li.classList.remove('focused');

        li.classList.toggle('selected');
        if (li.classList.contains('selected')) {
            this.pendingValues.add(value);
            li.setAttribute('part', 'dropdown-item selected');
        } else {
            this.pendingValues.delete(value);
            li.setAttribute('part', 'dropdown-item');
        }
    }

    protected handleOutsideClick(event: Event): void {
        if (!this.contains(event.target as Node)) {
            this.closeDropdown();
        }
    }

    protected handleKeyboardNavigation(event: KeyboardEvent): void {
        const isOpen = this.dropdown.style.display === "block";
        if (!isOpen) return;

        const lis = Array.from(this.contentArea.querySelectorAll('li[data-value]')) as HTMLElement[];
        if (!lis.length) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();
            let attempts = 0;
            do {
                this.cursorIndex = (this.cursorIndex + 1) % lis.length;
                attempts++;
            } while (lis[this.cursorIndex].classList.contains('disabled') && attempts < lis.length);
            this.updateCursor(lis);
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            let attempts = 0;
            do {
                this.cursorIndex = (this.cursorIndex - 1 + lis.length) % lis.length;
                attempts++;
            } while (lis[this.cursorIndex].classList.contains('disabled') && attempts < lis.length);
            this.updateCursor(lis);
        }

        // Não captura se estiver focado no botão ou em um input (deixar o Enter funcionar normalmente)
        const activeEl = this.shadowRoot!.activeElement || document.activeElement;
        if (activeEl && (activeEl.tagName === "BUTTON")) {
            return;
        }

        if (event.key === "Enter") {
            event.preventDefault();
            const li = lis[this.cursorIndex];
            if (li && !li.classList.contains('disabled')) {
                const value = li.dataset.value!;
                this.toggleSelectOption(li, value);
            }
        }
    }

    protected updateCursor(lis: HTMLElement[]): void {
        lis.forEach(li => {
            li.classList.remove('focused');
            li.setAttribute('part', li.classList.contains('selected') ? 'dropdown-item selected' : 'dropdown-item');
        });

        if (this.cursorIndex >= 0 && lis[this.cursorIndex]) {
            const targetLi = lis[this.cursorIndex];
            targetLi.classList.add('focused');

            // Atualiza o part incluindo o estado "focused"
            let partValue = 'dropdown-item';
            if (targetLi.classList.contains('selected')) {
                partValue += ' selected';
            }
            partValue += ' focused';
            targetLi.setAttribute('part', partValue);

            targetLi.scrollIntoView({ block: 'nearest' });
        }
    }

    protected handleSearch(): void {
        this.searchToken++;

        const searchTerm = this.searchInput.value.trim();
        if (!searchTerm) {
            this.populateOptions(this.options);
            this.loadingIndicator.style.visibility = "hidden";
            return;
        }

        this.loadingIndicator.style.visibility = "visible";
        this.searchEngine.search(searchTerm, this.searchToken);
    }

    protected handleClickitem(event: Event): void {
        const target = event.target as HTMLElement;
        const li = target.closest('li');

        if (li && !li.classList.contains('optgroup')) {
            const value = li.dataset.value!;
            this.toggleSelectOption(li, value);
        }
    }

    protected initSearchEngine(): void {
        if (!this.searchEngine) {
            switch (this.config.searchEngineMode) {
                case 'fuse-worker':
                    this.searchEngine = new WorkerSearchEngine(this.options, this.config.fuseOptions);
                    break;
                case 'fuse':
                    this.searchEngine = new FuseSearchEngine(this.options, this.config.fuseOptions);
                    break;
                default:
                    throw new Error(`Modo de mecanismo de busca desconhecido: ${this.config.searchEngineMode}`);
            }
        }

        this.searchEngine.onResults = (results, token) => this.handleSearchResults(results, token);
    }

    private handleSearchResults(results: FuseResult<OptionItem>[] | OptionItem[], token: number): void {
        if (token !== this.searchToken) return;
        this.populateOptions(results);
        this.loadingIndicator.style.visibility = "hidden";
    }

    protected initClusterize(): void {
        this.clusterize = new Clusterize({
            rows: [],
            scrollElem: this.scrollArea,
            contentElem: this.contentArea,
            ...this.config.clusterizeOptions
        });
    }

    // === STATE + SELECTION ===

    protected syncSelectElement(): void {
        const selectElement = this.querySelector("select") as HTMLSelectElement;
        selectElement.innerHTML = '';

        const optionStack = [...this.selectedValues]
            .reduce((fragment, v) => {

                const opt = this.optionMap.get(v)!;
                const option = document.createElement('option');
                option.value = String(opt.value);
                option.text = opt.text;
                option.selected = true;

                fragment.appendChild(option);
                return fragment;

            }, document.createDocumentFragment());

        selectElement.appendChild(optionStack);
        selectElement.dispatchEvent(new Event("change"));
    }

    protected applySelection(): void {
        this.selectedValues = new Set(this.pendingValues);
        this.syncSelectElement();
        this.updateFilter();
        this.closeDropdown();
        this.dispatchEvent(new Event("change"));
    }

    protected clear(event?: Event): void {
        event?.stopPropagation();
        this.selectedValues.clear();
        this.pendingValues.clear();
        this.populateOptions(this.options);
        this.syncSelectElement();
        this.updateFilter();
        this.dispatchEvent(new Event("change"));
    }

    protected toggleDropdown(): void {
        const isOpen = this.dropdown.style.display === "block";
        if (isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    protected closeDropdown(): void {
        this.dropdown.style.display = "none";
    }

    protected openDropdown(): void {
        this.cursorIndex = -1;

        this.searchInput.value = "";
        requestAnimationFrame(() => {
            this.searchInput.focus();
        });

        this.dropdown.style.display = "block";
        this.pendingValues = new Set(this.selectedValues);
        this.populateOptions(this.options);
    }

    private updateOptions() {
        this.searchEngine.update(this.options);

        this.populateOptions(this.options);
        this.syncSelectElement();
    }

    // === PUBLIC API ===

    public addOption(option: OptionItem): void {
        this.addOptions([option]);
    }

    public addOptions(options: OptionItem[]): void {
        options.forEach(option => {

            const opt: OptionItem = {
                value: String(option.value),
                text: option.text,
                group: option.group ?? null,
                disabled: option.disabled ?? false,
                data: option.data
            };

            const exists = this.optionMap.has(opt.value);
            if (!exists) {
                this.options.push(opt);
                this.optionMap.set(opt.value, opt);
            }
        });

        this.updateOptionsDebounced();
    }

    public selectOptions(values: OptionValue[]): void {
        values.forEach(v => {
            const value = String(v);
            const opt = this.optionMap.get(v);
            if (opt && !opt.disabled && !this.selectedValues.has(value)) {
                this.selectedValues.add(value);
            }
        });
        this.pendingValues = new Set(this.selectedValues);
        this.populateOptions(this.options);
        this.syncSelectElement();
        this.updateFilter();
        this.dispatchEvent(new Event("change"));
    }

    public deselectOptions(values: OptionValue[]): void {
        values.forEach(v => {
            const value = String(v);
            this.selectedValues.delete(value);
            this.pendingValues.delete(value);
        });

        this.populateOptions(this.options);
        this.syncSelectElement();
        this.updateFilter();
        this.dispatchEvent(new Event("change"));
    }

    public removeOptions(values: OptionValue[]): void {
        this.options = this.options.filter(opt => !values.includes(opt.value));

        values.forEach(v => {
            const value = String(v);
            this.selectedValues.delete(value);
            this.pendingValues.delete(value);
            this.optionMap.delete(value);
        });

        this.updateOptions();
        this.updateFilter();
    }

    public removeAllOptions(): void {
        this.options = [];
        this.selectedValues.clear();
        this.pendingValues.clear();
        this.optionMap.clear();

        this.updateOptions();
        this.updateFilter();
    }

    public clearSelection(): void {
        this.clear();
    }

    public disableOptions(values: OptionValue[]): void {
        values.forEach(v => {
            const value = String(v);
            const opt = this.optionMap.get(value);
            if (opt) {
                opt.disabled = true;
            }
        });
        this.populateOptions(this.options);
    }

    public enableOptions(values: OptionValue[]): void {
        values.forEach(v => {
            const value = String(v);
            const opt = this.optionMap.get(value);
            if (opt) {
                opt.disabled = false;
            }
        });
        this.populateOptions(this.options);
    }

    public setValue(values: OptionValue[]): void {
        this.selectedValues.clear();
        values.forEach(v => {
            const value = String(v);
            const opt = this.optionMap.get(value);
            if (opt && !opt.disabled) {
                this.selectedValues.add(value);
            }
        });
        this.pendingValues = new Set(this.selectedValues);
        this.populateOptions(this.options);
        this.syncSelectElement();
        this.updateFilter();
        this.dispatchEvent(new Event('change'));
    }

    public getValue(): string[] {
        return [...this.selectedValues];
    }

    public getSelected(): OptionItem[] {
        return [...this.selectedValues].map(v => this.optionMap.get(v)!);
    }

    public getAllOptions(): OptionItem[] {
        return [...this.options];
    }

    // Setter para injetar um mecanismo de busca customizado
    public set customSearchEngine(engine: SearchEngine) {
        this.searchEngine = engine;
    }
}

export type { OptionItem, OptionItemRender };
export default PlantaeFilterElement;
