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
