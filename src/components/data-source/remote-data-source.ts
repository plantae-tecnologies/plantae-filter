import type { OptionItem } from '../plantae-filter-element';
import type { DataSourceConfig, DataSourcePage } from '../../types/data-source';

const DEFAULT_PAGE_SIZE = 50;

function defaultBuildPageParams(cursor: string | number | undefined, pageSize: number): Record<string, string> {
    return {
        page: String(cursor ?? 1),
        per_page: String(pageSize),
    };
}

export class RemoteDataSource {
    private config: DataSourceConfig;
    private pageSize: number;
    private currentCursor?: string | number;
    private _hasMore: boolean = true;
    private _isLoading: boolean = false;
    private abortController?: AbortController;

    onData?: (items: OptionItem[]) => void;
    onLoadingChange?: (isLoading: boolean) => void;
    onError?: (error: Error) => void;
    onComplete?: () => void;

    get hasMore(): boolean {
        return this._hasMore;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    constructor(config: DataSourceConfig) {
        this.config = config;
        this.pageSize = config.pageSize ?? DEFAULT_PAGE_SIZE;
    }

    /** Executa uma requisição HTTP e retorna o body parseado */
    private async doFetch(params: Record<string, string>): Promise<any> {
        const method = this.config.method ?? 'GET';
        let response: Response;

        if (method === 'GET') {
            const url = new URL(this.config.url, globalThis.location?.origin);
            Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
            response = await fetch(url.toString(), {
                method: 'GET',
                headers: this.config.headers,
                signal: this.abortController?.signal,
            });
        } else {
            response = await fetch(this.config.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.config.headers,
                },
                body: JSON.stringify(params),
                signal: this.abortController?.signal,
            });
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }

    /** Executa o fetch HTTP de uma página */
    private async fetchPage(cursor: string | number | undefined): Promise<DataSourcePage> {
        const buildParams = this.config.buildPageParams ?? defaultBuildPageParams;
        const paginationParams = buildParams(cursor, this.pageSize);
        const staticParams = this.config.params ?? {};

        const body = await this.doFetch({ ...staticParams, ...paginationParams });
        return this.config.mapResponse(body, cursor);
    }

    /** Atualiza estado interno e emite items via callback */
    private consumePage(page: DataSourcePage): void {
        if ('hasMore' in page) {
            this._hasMore = page.hasMore;
            this.currentCursor = page.nextCursor;
        }
        if (page.items.length > 0) {
            this.onData?.(page.items);
        }
    }

    /** Gerencia loading state, abort controller e tratamento de erro */
    private async withLoading(fn: () => Promise<void>): Promise<void> {
        this._isLoading = true;
        this.onLoadingChange?.(true);
        this.abortController = new AbortController();

        try {
            await fn();
        } catch (err: any) {
            if (err?.name === 'AbortError') return;
            this.onError?.(err instanceof Error ? err : new Error(String(err)));
        } finally {
            this._isLoading = false;
            this.abortController = undefined;
            this.onLoadingChange?.(false);
        }
    }

    /** Busca todas as páginas restantes sequencialmente */
    private async fetchSequential(): Promise<void> {
        while (this._hasMore) {
            this.consumePage(await this.fetchPage(this.currentCursor));
        }
    }

    /** Busca todos os dados sem paginação (requisição única) */
    private async fetchSingle(): Promise<void> {
        const body = await this.doFetch(this.config.params ?? {});
        const page = this.config.mapResponse(body);
        if (page.items.length > 0) {
            this.onData?.(page.items);
        }
        this._hasMore = false;
    }

    /** Busca todas as páginas (paralelo quando possível, senão sequencial) */
    async fetchAll(): Promise<void> {
        await this.withLoading(async () => {
            if (this.config.pagination !== true) {
                await this.fetchSingle();
                return;
            }

            const concurrency = this.config.concurrency ?? 1;

            if (concurrency <= 1) {
                await this.fetchSequential();
                return;
            }

            // 1ª página: sequencial para descobrir totalItems
            const firstCursor = this.currentCursor;
            const firstPage = await this.fetchPage(firstCursor);
            this.consumePage(firstPage);

            if (!this._hasMore) return;

            // Fallback sequencial se não pode paralelizar (modo hasMore/cursor)
            if (!('totalItems' in firstPage)) {
                await this.fetchSequential();
                return;
            }

            // Calcula e busca páginas restantes em lotes paralelos
            const totalPages = Math.ceil(firstPage.totalItems / this.pageSize);
            const startPage = (typeof firstCursor === 'number' ? firstCursor : 1) + 1;
            const remaining = Array.from({ length: totalPages - startPage + 1 }, (_, i) => startPage + i);

            for (let i = 0; i < remaining.length; i += concurrency) {
                const results = await Promise.all(
                    remaining.slice(i, i + concurrency).map(c => this.fetchPage(c))
                );
                results.forEach(page => {
                    if (page.items.length > 0) this.onData?.(page.items);
                });
            }

            this._hasMore = false;
        });

        this.onComplete?.();
    }

    /** Reseta o estado de paginação */
    reset(): void {
        this.abort();
        this.currentCursor = undefined;
        this._hasMore = true;
        this._isLoading = false;
    }

    /** Cancela request em andamento */
    abort(): void {
        this.abortController?.abort();
        this.abortController = undefined;
    }
}
