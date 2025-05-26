import { vi, describe, it, expect, beforeEach } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import PlantaeFilterElement from '../../src/components/plantae-filter-element';

// Registra o custom element para o teste
customElements.define('plantae-filter', PlantaeFilterElement);

describe('Initialization', () => {
    let wrapper: PlantaeFilterElement;

    beforeEach(() => {
        vi.unmock('clusterize.js'); // para este teste, use a implementação real
    });

    it('should instantiate and emit ready event', async () => {
        const select = document.createElement('select');
        select.innerHTML = `
            <option value="1">Apple</option>
            <option value="2">Banana</option>
            <option value="3">Orange</option>
        `;

        wrapper = document.createElement('plantae-filter') as PlantaeFilterElement;
        wrapper.appendChild(select);
        document.body.appendChild(wrapper);

        const readyListener = vi.fn();
        wrapper.addEventListener('plantae-filter-ready', readyListener);

        // Simula ciclo do DOM
        await new Promise((resolve) => requestAnimationFrame(resolve));

        expect(wrapper.shadowRoot).toBeDefined();
        expect(wrapper.shadowRoot!.querySelector('#filter')).toBeInTheDocument();
        expect(select.style.display).toBe('none');
        expect(readyListener).toHaveBeenCalledTimes(1);
    });

    it('should render the filter label', () => {
        const filterText = wrapper.shadowRoot?.querySelector('#filterText')!;
        expect(filterText).toBeDefined();
    });

    it('should load options from the select', () => {
        expect(wrapper.getAllOptions()).toHaveLength(3);
    });

    it('should select options correctly', () => {
        wrapper.selectOptions(['1']);
        const selected = wrapper.getSelected();
        expect(selected[0].value).toBe('1');
    });

    it('opens dropdown when clicked', async () => {
        const shadowRoot = wrapper.shadowRoot!;
        const filter = shadowRoot.querySelector('[part="filter"]')!;
        const dropdown = shadowRoot.querySelector('[part="dropdown"]')! as HTMLDivElement;

        expect(dropdown.style.display).toBe('none');
        fireEvent.click(filter);
        expect(dropdown.style.display).toBe('block');
    });

    it('displays options inside dropdown', async () => {
        const shadowRoot = wrapper.shadowRoot!;

        const partsList = [
            '[part="dropdown-item"]',
            '[part="dropdown-item selected"]',
            '[part="dropdown-item disabled"]',
            '[part="dropdown-item selected disabled"]',
        ]

        const options = shadowRoot.querySelectorAll(partsList.join(','));
        expect(options.length).toBe(3);
        expect(options[0]).toHaveTextContent('Apple');
        expect(options[1]).toHaveTextContent('Banana');
        expect(options[2]).toHaveTextContent('Orange');
    });
});


describe('Public API', () => {
    let wrapper: PlantaeFilterElement;
    let select: HTMLSelectElement;

    beforeEach(async () => {
        vi.unmock('clusterize.js');

        select = document.createElement('select');
        select.innerHTML = `
            <option value="1">Apple</option>
            <option value="2">Banana</option>
        `;

        wrapper = document.createElement('plantae-filter') as PlantaeFilterElement;
        wrapper.appendChild(select);
        document.body.appendChild(wrapper);

        await new Promise((resolve) => requestAnimationFrame(resolve));
    });

    it('addOption adds a new item', () => {
        wrapper.addOption({ value: '3', text: 'Orange' });
        const all = wrapper.getAllOptions();
        expect(all.find(opt => opt.value === '3')).toBeDefined();
    });

    it('addOptions adds multiple new items', () => {
        wrapper.addOptions([
            { value: '3', text: 'Orange' },
            { value: '4', text: 'Grape' },
        ]);
        const all = wrapper.getAllOptions();
        expect(all).toHaveLength(4);
    });

    it('selectOptions selects multiple values', () => {
        wrapper.selectOptions(['1', '2']);
        const selected = wrapper.getSelected();
        expect(selected).toHaveLength(2);
        expect(selected.map(s => s.value)).toContain('1');
        expect(selected.map(s => s.value)).toContain('2');
    });

    it('selectOptions selects multiple values even dynamic ones', () => {
        // add dynamic options
        wrapper.addOptions([
            { value: '3', text: 'Orange' },
            { value: '4', text: 'Grape' },
        ]);

        const expectedValues = ['1', '2', '3', '4'];
        wrapper.selectOptions(expectedValues);

        const selected = wrapper.getSelected().map(s => s.value);

        expect(selected).toHaveLength(expectedValues.length);
        expect(selected).toEqual(expect.arrayContaining(expectedValues));
    });

    it('deselectOptions deselects multiple values even dynamic ones', () => {

        wrapper.addOptions([
            { value: '3', text: 'Orange' },
            { value: '4', text: 'Grape' },
        ]);

        wrapper.selectOptions(['1', '2', '3']);
        let selected = wrapper.getSelected().map(s => s.value);
        expect(selected).toHaveLength(3);
        expect(selected).toContain('1');
        expect(selected).toContain('2');
        expect(selected).toContain('3');

        wrapper.deselectOptions(['1', '2']);
        selected = wrapper.getSelected().map(s => s.value);

        expect(selected).toHaveLength(1);
        expect(selected).not.toContain('1');
        expect(selected).not.toContain('2');
        expect(selected).toContain('3');
    });

    it('removeOptions removes specified values', () => {
        wrapper.removeOptions(['1']);
        const all = wrapper.getAllOptions();
        expect(all.find(opt => opt.value === '1')).toBeUndefined();
    });

    it('removeAllOptions removes everything', () => {
        wrapper.removeAllOptions();
        const all = wrapper.getAllOptions();
        expect(all).toHaveLength(0);
    });

    it('clearSelection resets selected values', () => {
        wrapper.selectOptions(['1']);
        wrapper.clearSelection();
        const selected = wrapper.getSelected();
        expect(selected).toHaveLength(0);
    });

    it('disableOptions disables specific values', () => {
        wrapper.disableOptions(['1']);
        const opt = wrapper.getAllOptions().find(o => o.value === '1');
        expect(opt?.disabled).toBe(true);
    });

    it('enableOptions re-enables specific values', () => {
        wrapper.disableOptions(['1']);
        wrapper.enableOptions(['1']);
        const opt = wrapper.getAllOptions().find(o => o.value === '1');
        expect(opt?.disabled).toBe(false);
    });
});
