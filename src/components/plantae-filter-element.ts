import templateHtml from './plantae-filter.html?raw';
import styles from './plantae-filter.css?inline';
import { debounce, mergeOverlapping, attributesToCamelCase } from '../helpers/utils';
import Fuse from 'fuse.js';
import type { IFuseOptions, FuseResult, FuseResultMatch } from 'fuse.js';
import Clusterize from 'clusterize.js';
import type { ClusterizeOptions } from 'clusterize.js';

type OptionValue = string | number;

interface OptionItem {
    value: OptionValue;
    text: string;
    group?: string | null;
    disabled?: boolean;
}

class PlantaeFilterElement extends HTMLElement {

    private options: OptionItem[] = [];
    private optionMap: Map<string | number, OptionItem> = new Map();
    private selectedValues: Set<string> = new Set();
    private pendingValues: Set<string> = new Set();
    private fuse!: Fuse<OptionItem>;
    private clusterize!: Clusterize;
    private cursorIndex: number = -1;

    private searchInput!: HTMLInputElement;
    private applyButton!: HTMLElement;
    private clearButton!: HTMLElement;
    private dropdown!: HTMLElement;
    private filterText!: HTMLElement;
    private filter!: HTMLElement;
    private scrollArea!: HTMLElement;
    private contentArea!: HTMLElement;

    private config = {
        label: 'Filtro',
        allText: 'Todos',
        emptyText: 'Selecione',
        applyButtonText: 'Aplicar',
        groupSelectedLabel: 'Selecionados',
        searchPlaceholder: 'Buscar..',
        searchDebounceDelay: 100,
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

    constructor() {
        super();
    }

    connectedCallback(): void {
        this.loadConfig();
        this.loadTemplate();
        requestAnimationFrame(() => {
            this.extractOptions();
            this.attachEvents();
            this.initFuse();
            this.initClusterize();
            this.populateOptions(this.options);
            this.syncSelectElement();
            this.updateFilter();

            this.dispatchEvent(new CustomEvent('plantae-filter-ready', { bubbles: false }));
        });
    }

    private loadConfig(): void {
        const componentAttributes = attributesToCamelCase(this);

        this.config.label = componentAttributes.label || this.config.label;
        this.config.allText = componentAttributes.allText || this.config.allText;
        this.config.emptyText = componentAttributes.emptyText || this.config.emptyText;
        this.config.groupSelectedLabel = componentAttributes.groupSelectedLabel || this.config.groupSelectedLabel;
        this.config.applyButtonText = componentAttributes.applyButtonText || this.config.applyButtonText;
        this.config.searchPlaceholder = componentAttributes.searchPlaceholder || this.config.searchPlaceholder;
        this.config.searchDebounceDelay = Number(componentAttributes.searchDebounceDelay) || this.config.searchDebounceDelay;

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

    private extractOptions(): void {
        const selectElement = this.querySelector("select");
        if (!selectElement) return;

        const flatOptions: OptionItem[] = Array.from(selectElement.children).flatMap(child => {
            if (child instanceof HTMLOptGroupElement) {
                return Array.from(child.children).map(option => {
                    if (option instanceof HTMLOptionElement) {
                        const opt: OptionItem = {
                            value: option.value,
                            text: option.text,
                            group: child.label,
                            disabled: option.disabled
                        };
                        this.optionMap.set(opt.value, opt);
                        return opt;
                    }
                    return null;
                }).filter(Boolean) as OptionItem[];
            }

            if (child instanceof HTMLOptionElement) {
                const opt: OptionItem = {
                    value: child.value,
                    text: child.text,
                    group: null,
                    disabled: child.disabled
                };
                this.optionMap.set(opt.value, opt);
                return [opt];
            }

            return [];
        });

        this.options = flatOptions;
        selectElement.style.display = "none";
    }

    private loadTemplate(): void {
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

        this.searchInput.placeholder = this.config.searchPlaceholder;
        this.applyButton.innerText = this.config.applyButtonText;
    }

    private populateOptions(optionsToRender: OptionItem[] | Array<FuseResult<OptionItem>>): void {
        let rows: string[] = [];
        const selectedRows: string[] = [];
        const groupedRows: Map<string | null, string[]> = new Map();
        const isSearching = this.searchInput.value.trim();

        for (const opt of optionsToRender) {
            const { item, matches } = 'item' in opt ? { item: opt.item, matches: opt.matches } : { item: opt, matches: undefined };
            const valueStr = String(item.value);
            const isSelected = this.pendingValues.has(valueStr);
            const isDisabled = item.disabled;

            const text = isSearching ? this.formatTextWithHighlight(item.text, matches) : item.text;

            const classes = isSelected ? (isDisabled ? "selected disabled" : "selected") : (isDisabled ? "disabled" : "");

            const li = `<li part="dropdown-item ${classes}" class="${classes}" data-value="${valueStr}" ${isDisabled ? 'aria-disabled="true"' : ''}>${text}</li>`;

            if (isSelected) {
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
                rows.push(`<li class="optgroup">${group ?? ''}</li>`);
                rows = rows.concat(items);
            });
        }

        this.clusterize.clear();
        this.clusterize.update(rows);
    }

    private formatTextWithHighlight(text: string, matches?: readonly FuseResultMatch[]): string {
        if (!matches || matches.length === 0) return text;

        const match = matches.find(m => m.key === "text");
        if (!match) return text;

        const mergedIndices = mergeOverlapping(match.indices);
        let highlighted = "";
        let lastIndex = 0;

        mergedIndices.forEach(([start, end]) => {
            highlighted += text.slice(lastIndex, start);
            highlighted += `<mark part="highlight">${text.slice(start, end + 1)}</mark>`;
            lastIndex = end + 1;
        });

        highlighted += text.slice(lastIndex);
        return highlighted;
    }

    private updateFilter(): void {
        const total = this.options.length;
        const count = this.selectedValues.size;

        const selectedTexts = this.options
            .filter(opt => this.selectedValues.has(String(opt.value)))
            .map(opt => opt.text);

        this.filterText.innerHTML = count
            ? `<span class='counter-filter'>${count}</span> <strong>${this.config.label}:</strong> ${count === total ? this.config.allText : selectedTexts.join(", ")}`
            : `<strong>${this.config.label}:</strong> ${this.config.emptyText}`;

        this.clearButton.style.opacity = count ? '1' : '0.5';
        this.clearButton.style.pointerEvents = count ? 'auto' : 'none';

        this.filter.setAttribute("title", count ? selectedTexts.join(", ") : '');
    }

    // === EVENT HANDLERS ===

    private attachEvents(): void {
        this.filter.addEventListener("click", () => this.toggleDropdown());
        this.clearButton.addEventListener("click", (e) => this.clear(e));
        this.applyButton.addEventListener("click", () => this.applySelection());
        this.searchInput.addEventListener("input", debounce(this.handleSearch.bind(this), this.config.searchDebounceDelay));
        this.contentArea.addEventListener('click', this.handleClickitem.bind(this));
        
        document.addEventListener("keydown", (e: KeyboardEvent) => this.handleKeyboardNavigation(e));
        document.addEventListener("click", (e) => this.handleOutsideClick(e));
    }

    private toggleSelectOption(li: HTMLElement, value: string): void {
        li.classList.remove("focused");
    
        li.classList.toggle("selected");
        if (li.classList.contains("selected")) {
            this.pendingValues.add(value);
            li.setAttribute('part', 'dropdown-item selected');
        } else {
            this.pendingValues.delete(value);
            li.setAttribute('part', 'dropdown-item');
        }
    }

    private handleOutsideClick(event: Event): void {
        if (!this.contains(event.target as Node)) {
            this.closeDropdown();
        }
    }

    private handleKeyboardNavigation(event: KeyboardEvent): void {
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

    private updateCursor(lis: HTMLElement[]): void {
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

    private handleSearch(): void {
        const searchTerm = this.searchInput.value.trim();
        if (!searchTerm) {
            this.populateOptions(this.options);
            return;
        }
    
        console.time('search');
        const results = this.fuse.search(searchTerm);
        console.timeEnd('search');
        console.time('render');
        this.populateOptions(results);
        console.timeEnd('render');
    }

    private handleClickitem(event: Event): void {
        const target = event.target as HTMLElement;
        if (target.tagName.toLowerCase() === 'li' && !target.classList.contains('optgroup')) {
            const li = target as HTMLElement;
            const value = li.dataset.value!;
            this.toggleSelectOption(li, value);
        }
    }

    private initFuse(): void {
        this.fuse = new Fuse(this.options, this.config.fuseOptions);
    }

    private initClusterize(): void {
        this.clusterize = new Clusterize({
            rows: [],
            scrollElem: this.scrollArea,
            contentElem: this.contentArea,
            ...this.config.clusterizeOptions
        });
    }

    // === STATE + SELECTION ===

    private syncSelectElement(): void {
        const selectElement = this.querySelector("select") as HTMLSelectElement;
        selectElement.innerHTML = '';

        this.options
            .filter(opt => this.selectedValues.has(String(opt.value)))
            .forEach(opt => {
                const option = document.createElement('option');
                option.value = String(opt.value);
                option.text = opt.text;
                option.selected = true;
                selectElement.appendChild(option);
            });
    }

    private applySelection(): void {
        this.selectedValues = new Set(this.pendingValues);
        this.syncSelectElement();
        this.updateFilter();
        this.closeDropdown();
        this.dispatchEvent(new Event("change"));
    }

    private clear(event?: Event): void {
        event?.stopPropagation();
        this.selectedValues.clear();
        this.pendingValues.clear();
        this.populateOptions(this.options);
        this.syncSelectElement();
        this.updateFilter();
        this.dispatchEvent(new Event("change"));
    }

    private toggleDropdown(): void {
        const isOpen = this.dropdown.style.display === "block";
        if (isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    private closeDropdown(): void {
        this.dropdown.style.display = "none";
    }

    private openDropdown(): void {
        this.cursorIndex = -1;

        this.searchInput.value = "";
        requestAnimationFrame(() => {
            this.searchInput.focus();
        });

        this.dropdown.style.display = "block";
        this.pendingValues = new Set(this.selectedValues);
        this.populateOptions(this.options);
    }

    // === PUBLIC API ===

    public addOption(option: OptionItem): void {
        this.addOptions([option]);
    }

    public addOptions(options: OptionItem[]): void {
        console.time('add');
        options.forEach(option => {
            const exists = this.optionMap.has(option.value);
            if (!exists) {
                this.options.push({
                    value: option.value,
                    text: option.text,
                    group: option.group ?? null,
                    disabled: option.disabled ?? false
                });
            }
        });
        console.timeEnd('add');

        console.time('fuse');
        this.fuse.setCollection(this.options);
        console.timeEnd('fuse');

        console.time('populateOptions');
        this.populateOptions(this.options);
        console.timeEnd('populateOptions');
        this.syncSelectElement();
    }

    public selectOptions(values: OptionValue[]): void {
        values.forEach(v => {
            const opt = this.optionMap.get(v);
            if (opt && !opt.disabled && !this.selectedValues.has(String(v))) {
                this.selectedValues.add(String(v));
            }
        });
        this.pendingValues = new Set(this.selectedValues);
        this.populateOptions(this.options);
        this.syncSelectElement();
        this.updateFilter();
    }

    public removeOptions(values: OptionValue[]): void {
        this.options = this.options.filter(opt => !values.includes(opt.value));
        
        values.forEach(v => {
            this.selectedValues.delete(String(v));
            this.pendingValues.delete(String(v));
        });

        this.fuse.setCollection(this.options);

        this.populateOptions(this.options);
        this.syncSelectElement();
        this.updateFilter();
    }

    public removeAllOptions(): void {
        this.options = [];
        this.selectedValues.clear();
        this.pendingValues.clear();

        this.fuse.setCollection(this.options);

        this.populateOptions(this.options);
        this.syncSelectElement();
        this.updateFilter();
    }

    public clearSelection(): void {
        this.clear();
    }

    public disableOptions(values: OptionValue[]): void {
        values.forEach(v => {
            const opt = this.optionMap.get(v);
            if (opt) {
                opt.disabled = true;
            }
        });
        this.populateOptions(this.options);
    }

    public enableOptions(values: OptionValue[]): void {
        values.forEach(v => {
            const opt = this.optionMap.get(v);
            if (opt) {
                opt.disabled = false;
            }
        });
        this.populateOptions(this.options);
    }

    public getSelected(): OptionItem[] {
        return this.options.filter(opt => this.selectedValues.has(String(opt.value)));
    }

    public getAllOptions(): OptionItem[] {
        return [...this.options];
    }
}

export default PlantaeFilterElement;
