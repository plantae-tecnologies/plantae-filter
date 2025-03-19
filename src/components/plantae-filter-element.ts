import templateHtml from './plantae-filter.html?raw';
import styles from './plantae-filter.css?inline';
import { debounce } from '../helpers/utils';
import Fuse from 'fuse.js';
import Clusterize from 'clusterize.js';

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

class PlantaeFilterElement extends HTMLElement {
    // === STATE ===
    private options: OptionItem[] = [];
    private selectedValues: string[] = [];
    private pendingValues: string[] = [];
    private fuse!: Fuse<OptionItem>;
    private clusterize!: Clusterize;

    constructor() {
        super();
    }

    connectedCallback(): void {
        this.loadTemplate();
        requestAnimationFrame(() => {
            this.extractOptions();
            this.attachEvents();
            this.initSearch();
            this.initClusterize();
            this.populateOptions(this.options);
            this.syncSelectElement();
            this.updateBadge();
        });
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
                        value: opt.value,
                        text: opt.text,
                        group: groupLabel
                    });
                });
            } else if (child.tagName.toLowerCase() === 'option') {
                const opt = child as HTMLOptionElement;
                flatOptions.push({
                    value: opt.value,
                    text: opt.text,
                    group: null
                });
            }
        });

        this.options = flatOptions;
        selectElement.style.display = "none";

        this.fuse = new Fuse(flatOptions, { keys: ['text', 'value'], threshold: 0.3 });
    }

    private loadTemplate(): void {
        const template = document.createElement('template');
        template.innerHTML = `<style>${styles}</style>${templateHtml}`;
        this.attachShadow({ mode: 'open' })!.append(template.content.cloneNode(true));
    }

    private populateOptions(optionsToRender: OptionItem[]): void {
        const rows: string[] = [];
        const selectedRows: string[] = [];
        const groupedRows: Map<string | null, string[]> = new Map();
        const pendingSet = new Set(this.pendingValues);

        const searchInput = this.shadowRoot!.getElementById("searchInput") as HTMLInputElement;
        const isSearching = !!searchInput?.value.trim();

        for (const opt of optionsToRender) {
            const isSelected = pendingSet.has(opt.value);
            const li = `<li part="dropdown-item${isSelected ? ' selected' : ''}" data-value="${opt.value}">${opt.text}</li>`;

            if (isSelected) {
                selectedRows.push(li);
            } else {
                if (!groupedRows.has(opt.group)) {
                    groupedRows.set(opt.group, []);
                }
                groupedRows.get(opt.group)!.push(li);
            }
        }

        if (selectedRows.length > 0) {
            rows.push(`<li class="optgroup">Selecionados (${selectedRows.length})</li>`);
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

    private updateBadge(): void {
        const label = this.getAttribute('label') || 'Selecionado';
        const allText = this.getAttribute('all-text') || 'Todos';
        const emptyText = this.getAttribute('empty-text') || 'Selecione';

        const total = this.options.length;
        const count = this.selectedValues.length;

        const selectedTexts = this.options
            .filter(opt => this.selectedValues.includes(opt.value))
            .map(opt => opt.text);

        const badgeText = this.shadowRoot!.getElementById("badgeText") as HTMLElement;
        badgeText.innerHTML = count
            ? `<span class='counter-badge'>${count}</span> <strong>${label}:</strong> ${count === total ? allText : selectedTexts.join(", ")}`
            : `<strong>${label}:</strong> ${emptyText}`;

        const clearBtn = this.shadowRoot!.getElementById("clearButton") as HTMLElement;
        clearBtn.style.opacity = count ? '1' : '0.5';
        clearBtn.style.pointerEvents = count ? 'auto' : 'none';

        const badge = this.shadowRoot!.getElementById("badge") as HTMLElement;
        badge.setAttribute("title", count ? selectedTexts.join(", ") : '');
    }

    // === EVENT HANDLERS ===

    private attachEvents(): void {
        document.addEventListener("keydown", (e: KeyboardEvent) => this.handleEscKey(e));
        this.shadowRoot!.getElementById("badge")!.addEventListener("click", () => this.openDropdown());
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

            const flatResults = this.fuse.search(searchTerm).map(r => r.item);
            this.populateOptions(flatResults);
            this.syncPendingWithApplied();
        };

        input.addEventListener("input", debounce(handleSearch, 300));
    }

    private initClusterize(): void {
        this.clusterize = new Clusterize({
            rows: [],
            scrollElem: this.shadowRoot!.getElementById('scrollArea') as HTMLElement,
            contentElem: this.shadowRoot!.getElementById('contentArea') as HTMLElement,
            tag: 'ul',
            no_data_text: "Não encontrado"
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
            .filter(opt => this.selectedValues.includes(opt.value))
            .forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.text = opt.text;
                option.selected = true;
                selectElement.appendChild(option);
            });
    }

    private applySelection(): void {
        this.selectedValues = [...this.pendingValues];
        this.syncSelectElement();
        this.updateBadge();
        this.closeDropdown();
        this.dispatchEvent(new Event("change"));
    }

    private clearSelectionInterno(event?: Event): void {
        event?.stopPropagation();
        this.selectedValues = [];
        this.pendingValues = [];
        this.populateOptions(this.options);
        this.syncSelectElement();
        this.updateBadge();
        this.dispatchEvent(new Event("change"));
    }

    private closeDropdown(): void {
        const dropdown = this.shadowRoot!.getElementById("dropdown") as HTMLElement;
        dropdown.style.display = "none";
    }

    private openDropdown(): void {
        const searchInput = this.shadowRoot!.getElementById("searchInput") as HTMLInputElement;
        if (searchInput) searchInput.value = "";
        const dropdown = this.shadowRoot!.getElementById("dropdown") as HTMLElement;
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

    private isOptionDisabled(value: string): boolean {
        const li = this.shadowRoot!.querySelector(`#contentArea li[data-value='${value}']`);
        return li?.classList.contains('disabled') || false;
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

    public selectOptions(values: string[]): void {
        const validValues = values.filter(v => {
            const opt = this.options.find(opt => opt.value === v);
            return opt && !this.isOptionDisabled(opt.value);
        });

        validValues.forEach(v => {
            if (!this.selectedValues.includes(v)) {
                this.selectedValues.push(v);
            }
        });

        this.pendingValues = [...this.selectedValues];
        this.populateOptions(this.options);
        this.syncSelectElement();
        this.updateBadge();
    }

    public removeOptions(values: string[]): void {
        this.options = this.options.filter(opt => !values.includes(opt.value));
        this.selectedValues = this.selectedValues.filter(v => !values.includes(v));
        this.pendingValues = this.pendingValues.filter(v => !values.includes(v));

        this.fuse.setCollection(this.options);

        this.populateOptions(this.options);
        this.syncSelectElement();
        this.updateBadge();
    }

    public removeAllOptions(): void {
        this.options = [];
        this.selectedValues = [];
        this.pendingValues = [];

        this.fuse.setCollection(this.options);

        this.populateOptions(this.options);
        this.syncSelectElement();
        this.updateBadge();
    }

    public clearSelection(): void {
        this.clearSelectionInterno();
    }

    public setOptionDisabled(values: string[], disabled: boolean): void {
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

    public getSelected(): OptionItem[] {
        return this.options.filter(opt => this.selectedValues.includes(opt.value));
    }

    public getAllOptions(): OptionItem[] {
        return [...this.options];
    }
}

export default PlantaeFilterElement;
