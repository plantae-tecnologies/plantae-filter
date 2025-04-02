import { FuseResult, IFuseOptions } from "fuse.js";
import { SearchEngine } from "./search-engine.interface";
import { OptionItem } from "../plantae-filter-element";

class WorkerSearchEngine implements SearchEngine {
    onResults?: (results: FuseResult<OptionItem>[] | OptionItem[], token: number) => void;
    private worker: Worker;

    constructor(collection: OptionItem[], options: IFuseOptions<OptionItem>) {
        this.worker = new Worker(
            new URL('../../components/search-engine/search-worker.ts?worker&inline', import.meta.url),
            { type: 'module' }
        );

        // Inicializa o worker com os dados iniciais
        this.worker.postMessage({
            type: 'init',
            payload: { collection, options }
        });

        // Adapta a resposta do worker para o formato esperado
        this.worker.onmessage = (e: MessageEvent) => {
            const { type, token, results } = e.data;
            if (type === 'results' && this.onResults) {
                this.onResults(results, token);
            }
        };
    }

    search(term: string, token: number): void {
        this.worker.postMessage({
            type: 'search',
            payload: { term, token }
        });
    }

    update(collection: OptionItem[]): void {
        this.worker.postMessage({
            type: 'update',
            payload: { collection }
        });
    }
}

export default WorkerSearchEngine;
