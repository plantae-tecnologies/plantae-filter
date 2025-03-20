import templateHtml from './plantae-filter.html?raw';
import styles from './plantae-filter.css?inline';
import { debounce, mergeOverlapping } from '../helpers/utils';
import Fuse from 'fuse.js';
import type { IFuseOptions, FuseResult, FuseResultMatch } from 'fuse.js';
import Clusterize from 'clusterize.js';
import type { ClusterizeOptions } from 'clusterize.js';

type OptionValue = string | number;

interface OptionItem {
    value: OptionValue;
    text: string;
    group: string | null;
}

interface NewOption {
    value: OptionValue;
    text: string;
    group?: string | null;
    disabled?: boolean;
}

class PlantaeFilterElement extends HTMLElement {
    // === STATE ===
    private options: OptionItem[] = [];
    private selectedValues: string[] = [];
    private pendingValues: string[] = [];
    private fuse!: Fuse<OptionItem>;
    private clusterize!: Clusterize;

    // === CONFIG ===
    private config = {
        label: 'Filtro',
        allText: 'Todos',
        emptyText: 'Selecione',
        applyButtonText: 'Aplicar',
        groupSelectedLabel: 'Selecionados',
        searchPlaceholder: 'Buscar..',
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
            this.initSearch();
            this.initClusterize();
            this.populateOptions(this.options);
            this.syncSelectElement();
            this.updateFilter();

            this.dispatchEvent(new CustomEvent('plantae-filter-ready', { bubbles: false }));
        });
    }

    private loadConfig(): void {
        // Texts
        this.config.label = this.getAttribute('filter-label') || this.config.label;
        this.config.allText = this.getAttribute('filter-all-text') || this.config.allText;
        this.config.emptyText = this.getAttribute('filter-empty-text') || this.config.emptyText;
        this.config.groupSelectedLabel = this.getAttribute('filter-group-selected-label') || this.config.groupSelectedLabel;
        this.config.applyButtonText = this.getAttribute('filter-apply-button-text') || this.config.applyButtonText;
        this.config.searchPlaceholder = this.getAttribute('filter-search-placeholder') || this.config.searchPlaceholder;

        // Fuse Options
        const fuseAttr = this.getAttribute('filter-fuse-options');
        if (fuseAttr) {
            try {
                const parsed = JSON.parse(fuseAttr);
                this.config.fuseOptions = { ...this.config.fuseOptions, ...parsed };
            } catch (err) {
                console.warn("Invalid JSON for fuse-options", err);
            }
        }

        // Clusterize Options
        const clusterizeAttr = this.getAttribute('filter-clusterize-options');
        if (clusterizeAttr) {
            try {
                const parsed = JSON.parse(clusterizeAttr);
                this.config.clusterizeOptions = { ...this.config.clusterizeOptions, ...parsed };
            } catch (err) {
                console.warn("Invalid JSON for clusterize-options", err);
            }
        }
    }

    // === DOM / TEMPLATE ===

    private extractOptions(): void {
        const selectElement = this.querySelector("select");
        if (!selectElement) return;

        const flatOptions: OptionItem[] = [];
        Array.from(selectElement.children).forEach(child => {
            if (child.tagName.toLowerCase() === 'optgroup') {
                const group = child as HTMLOptGroupElement;
                const groupLabel = group.label;
                Array.from(group.children).forEach(option => {
                    const opt = option as HTMLOptionElement;
                    flatOptions.push({
                        value: isNaN(Number(opt.value)) ? opt.value : Number(opt.value),
                        text: opt.text,
                        group: groupLabel
                    });
                });
            } else if (child.tagName.toLowerCase() === 'option') {
                const opt = child as HTMLOptionElement;
                flatOptions.push({
                    value: isNaN(Number(opt.value)) ? opt.value : Number(opt.value),
                    text: opt.text,
                    group: null
                });
            }
        });

        this.options = flatOptions;
        selectElement.style.display = "none";

        this.fuse = new Fuse(flatOptions, this.config.fuseOptions);
    }

    private loadTemplate(): void {
        const template = document.createElement('template');
        template.innerHTML = `<style>${styles}</style>${templateHtml}`;
        this.attachShadow({ mode: 'open' })!.append(template.content.cloneNode(true));

        const searchInput = this.shadowRoot?.getElementById("searchInput");
        if (searchInput instanceof HTMLInputElement) {
            searchInput.placeholder = this.config.searchPlaceholder;
        }

        const applyButton = this.shadowRoot?.getElementById("applyButton");
        if (applyButton instanceof HTMLElement) {
            applyButton.innerText = this.config.applyButtonText;
        }
    }

    private populateOptions(optionsToRender: OptionItem[] | Array<FuseResult<OptionItem>>): void {
        const rows: string[] = [];
        const selectedRows: string[] = [];
        const groupedRows: Map<string | null, string[]> = new Map();
        const pendingSet = new Set(this.pendingValues.map(String));

        const searchInput = this.shadowRoot!.getElementById("searchInput") as HTMLInputElement;
        const isSearching = !!searchInput?.value.trim();

        const formatTextWithHighlight = (text: string, matches?: readonly FuseResultMatch[]): string => {
            if (!matches || matches.length === 0) return text;

            const match = matches.find(m => m.key === "text" || m.key === "value");
            if (!match) return text;

            // Ordena os índices e mescla sobreposições
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
        };

        for (const opt of optionsToRender) {
            let option: OptionItem;
            let matches: readonly FuseResultMatch[] | undefined;

            if ('item' in opt) {
                // Resultado do Fuse
                option = opt.item;
                matches = opt.matches;
            } else {
                option = opt;
                matches = undefined;
            }

            const isSelected = pendingSet.has(String(option.value));
            const text = isSearching ? formatTextWithHighlight(option.text, matches) : option.text;

            const li = `<li part="dropdown-item${isSelected ? ' selected' : ''}" data-value="${option.value}">${text}</li>`;

            if (isSelected) {
                selectedRows.push(li);
            } else {
                if (!groupedRows.has(option.group)) {
                    groupedRows.set(option.group, []);
                }
                groupedRows.get(option.group)!.push(li);
            }
        }

        if (selectedRows.length > 0) {
            rows.push(`<li class="optgroup">${this.config.groupSelectedLabel} (${selectedRows.length})</li>`);
            rows.push(...selectedRows);
            rows.push(`<li class="optgroup"></li>`);
        }

        if (isSearching) {
            groupedRows.forEach(items => rows.push(...items));
        } else {
            let lastGroup: string | null = null;
            for (const [group, items] of groupedRows) {
                if (group !== lastGroup) {
                    if (group) {
                        rows.push(`<li class="optgroup">${group}</li>`);
                    } else if (lastGroup !== null) {
                        rows.push(`<li class="optgroup"></li>`);
                    }
                    lastGroup = group;
                }
                rows.push(...items);
            }
        }

        this.clusterize.update(rows);
    }

    private updateFilter(): void {
        const total = this.options.length;
        const count = this.selectedValues.length;

        const selectedTexts = this.options
            .filter(opt => this.selectedValues.includes(String(opt.value)))
            .map(opt => opt.text);

        const filterText = this.shadowRoot!.getElementById("filterText") as HTMLElement;
        filterText.innerHTML = count
            ? `<span class='counter-filter'>${count}</span> <strong>${this.config.label}:</strong> ${count === total ? this.config.allText : selectedTexts.join(", ")}`
            : `<strong>${this.config.label}:</strong> ${this.config.emptyText}`;

        const clearBtn = this.shadowRoot!.getElementById("clearButton") as HTMLElement;
        clearBtn.style.opacity = count ? '1' : '0.5';
        clearBtn.style.pointerEvents = count ? 'auto' : 'none';

        const filter = this.shadowRoot!.getElementById("filter") as HTMLElement;
        filter.setAttribute("title", count ? selectedTexts.join(", ") : '');
    }

    // === EVENT HANDLERS ===

    private attachEvents(): void {
        document.addEventListener("keydown", (e: KeyboardEvent) => this.handleEscKey(e));
        this.shadowRoot!.getElementById("filter")!.addEventListener("click", () => this.toggleDropdown());
        this.shadowRoot!.getElementById("clearButton")!.addEventListener("click", (e) => this.clearSelectionInterno(e));
        this.shadowRoot!.getElementById("applyButton")!.addEventListener("click", () => this.applySelection());
        document.addEventListener("click", (e) => this.handleOutsideClick(e));
    }

    private toggleSelectOption(li: HTMLElement, value: string): void {
        li.classList.toggle("selected");
        if (li.classList.contains("selected")) {
            this.pendingValues.push(value);
            li.setAttribute('part', 'dropdown-item selected');
        } else {
            this.pendingValues = this.pendingValues.filter(v => v !== value);
            li.setAttribute('part', 'dropdown-item');
        }
    }

    private handleOutsideClick(event: Event): void {
        if (!this.contains(event.target as Node)) {
            this.closeDropdown();
        }
    }

    private handleEscKey(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            this.closeDropdown();
        }
    }

    private initSearch(): void {
        const input = this.shadowRoot!.getElementById("searchInput") as HTMLInputElement;


        const handleSearch = () => {
            const searchTerm = input.value.trim();
            if (!searchTerm) {
                this.populateOptions(this.options);
                this.syncPendingWithApplied();
                return;
            }
        
            const results = this.fuse.search(searchTerm);
            this.populateOptions(results);
            this.syncPendingWithApplied();
        };

        input.addEventListener("input", debounce(handleSearch, 300));
    }

    private initClusterize(): void {
        this.clusterize = new Clusterize({
            rows: [],
            scrollElem: this.shadowRoot!.getElementById('scrollArea') as HTMLElement,
            contentElem: this.shadowRoot!.getElementById('contentArea') as HTMLElement,
            ...this.config.clusterizeOptions
        });

        this.shadowRoot!.getElementById('contentArea')!.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.tagName.toLowerCase() === 'li' && !target.classList.contains('optgroup')) {
                const li = target as HTMLElement;
                const value = li.dataset.value!;
                this.toggleSelectOption(li, value);
            }
        });
    }

    // === STATE + SELECTION ===

    private syncSelectElement(): void {
        const selectElement = this.querySelector("select") as HTMLSelectElement;
        selectElement.innerHTML = '';

        this.options
            .filter(opt => this.selectedValues.includes(String(opt.value)))
            .forEach(opt => {
                const option = document.createElement('option');
                option.value = String(opt.value);
                option.text = opt.text;
                option.selected = true;
                selectElement.appendChild(option);
            });
    }

    private applySelection(): void {
        this.selectedValues = [...this.pendingValues];
        this.syncSelectElement();
        this.updateFilter();
        this.closeDropdown();
        this.dispatchEvent(new Event("change"));
    }

    private clearSelectionInterno(event?: Event): void {
        event?.stopPropagation();
        this.selectedValues = [];
        this.pendingValues = [];
        this.populateOptions(this.options);
        this.syncSelectElement();
        this.updateFilter();
        this.dispatchEvent(new Event("change"));
    }

    private toggleDropdown(): void {
        const dropdown = this.shadowRoot!.getElementById("dropdown") as HTMLElement;
        const isOpen = dropdown.style.display === "block";
        if (isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    private closeDropdown(): void {
        const dropdown = this.shadowRoot!.getElementById("dropdown") as HTMLElement;
        dropdown.style.display = "none";
    }

    private openDropdown(): void {
        const searchInput = this.shadowRoot!.getElementById("searchInput") as HTMLInputElement;
        const dropdown = this.shadowRoot!.getElementById("dropdown") as HTMLElement;

        if (searchInput) {
            searchInput.value = "";
            requestAnimationFrame(() => {
                searchInput.focus();
            });
        }

        dropdown.style.display = "block";
        this.pendingValues = [...this.selectedValues];
        this.populateOptions(this.options);
        this.syncPendingWithApplied();
    }

    private syncPendingWithApplied(): void {
        const lis = this.shadowRoot!.querySelectorAll('#contentArea li[data-value]');
        lis.forEach(li => {
            const el = li as HTMLElement;
            const value = el.dataset.value!;
            if (this.pendingValues.includes(value)) {
                el.classList.add("selected");
                el.setAttribute('part', 'dropdown-item selected');
            } else {
                el.classList.remove("selected");
                el.setAttribute('part', 'dropdown-item');
            }
        });
    }

    private isOptionDisabled(value: OptionValue): boolean {
        const li = this.shadowRoot!.querySelector(`#contentArea li[data-value='${value}']`);
        return li?.classList.contains('disabled') || false;
    }

    private setOptionsDisabled(values: OptionValue[], disabled: boolean): void {
        const lis = this.shadowRoot!.querySelectorAll('#contentArea li[data-value]');
        lis.forEach(li => {
            const el = li as HTMLElement;
            const value = el.dataset.value!;
            if (values.includes(value)) {
                if (disabled) {
                    el.classList.add('disabled');
                    el.setAttribute('aria-disabled', 'true');
                    el.style.pointerEvents = 'none';
                    el.style.opacity = '0.5';
                } else {
                    el.classList.remove('disabled');
                    el.removeAttribute('aria-disabled');
                    el.style.pointerEvents = '';
                    el.style.opacity = '';
                }
            }
        });
    }

    // === PUBLIC API ===

    public addOption(option: NewOption): void {
        const exists = this.options.find(opt => opt.value === option.value);
        if (exists) return;

        this.options.push({
            value: option.value,
            text: option.text,
            group: option.group ?? null,
        });

        this.fuse.setCollection(this.options);

        this.populateOptions(this.options);
        this.syncSelectElement();
    }

    public addOptions(options: NewOption[]): void {
        options.forEach(option => {
            const exists = this.options.find(opt => opt.value === option.value);
            if (!exists) {
                this.options.push({
                    value: option.value,
                    text: option.text,
                    group: option.group ?? null,
                });
            }
        });

        this.fuse.setCollection(this.options);

        this.populateOptions(this.options);
        this.syncSelectElement();
    }

    public selectOptions(values: OptionValue[]): void {
        const validValues = values.filter(v => {
            const opt = this.options.find(opt => opt.value === v);
            return opt && !this.isOptionDisabled(opt.value);
        });

        validValues.forEach(v => {
            if (!this.selectedValues.includes(String(v))) {
                this.selectedValues.push(String(v));
            }
        });

        this.pendingValues = [...this.selectedValues];
        this.populateOptions(this.options);
        this.syncSelectElement();
        this.updateFilter();
    }

    public removeOptions(values: OptionValue[]): void {
        this.options = this.options.filter(opt => !values.includes(opt.value));
        this.selectedValues = this.selectedValues.filter(v => !values.includes(v));
        this.pendingValues = this.pendingValues.filter(v => !values.includes(v));

        this.fuse.setCollection(this.options);

        this.populateOptions(this.options);
        this.syncSelectElement();
        this.updateFilter();
    }

    public removeAllOptions(): void {
        this.options = [];
        this.selectedValues = [];
        this.pendingValues = [];

        this.fuse.setCollection(this.options);

        this.populateOptions(this.options);
        this.syncSelectElement();
        this.updateFilter();
    }

    public clearSelection(): void {
        this.clearSelectionInterno();
    }

    public disableOptions(values: string[]): void {
        this.setOptionsDisabled(values, true);
    }
    
    public enableOptions(values: string[]): void {
        this.setOptionsDisabled(values, false);
    }

    public getSelected(): OptionItem[] {
        return this.options.filter(opt => this.selectedValues.includes(String(opt.value)));
    }

    public getAllOptions(): OptionItem[] {
        return [...this.options];
    }
}

export default PlantaeFilterElement;
