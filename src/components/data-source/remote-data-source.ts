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

    /** Callback chamado quando novos items são carregados */
    onData?: (items: OptionItem[]) => void;
    /** Callback chamado quando o estado de loading muda */
    onLoadingChange?: (isLoading: boolean) => void;
    /** Callback chamado quando ocorre um erro */
    onError?: (error: Error) => void;
    /** Callback chamado quando todas as páginas foram carregadas */
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

    /** Busca a próxima página */
    async fetchNextPage(): Promise<void> {
        if (!this._hasMore || this._isLoading) return;

        this._isLoading = true;
        this.onLoadingChange?.(true);

        const buildParams = this.config.buildPageParams ?? defaultBuildPageParams;
        const paginationParams = buildParams(this.currentCursor, this.pageSize);
        const staticParams = this.config.params ?? {};
        const allParams = { ...staticParams, ...paginationParams };

        const method = this.config.method ?? 'GET';
        this.abortController = new AbortController();

        try {
            let response: Response;

            if (method === 'GET') {
                const url = new URL(this.config.url, globalThis.location?.origin);
                Object.entries(allParams).forEach(([k, v]) => url.searchParams.set(k, v));
                response = await fetch(url.toString(), {
                    method: 'GET',
                    headers: this.config.headers,
                    signal: this.abortController.signal,
                });
            } else {
                response = await fetch(this.config.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...this.config.headers,
                    },
                    body: JSON.stringify(allParams),
                    signal: this.abortController.signal,
                });
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const body = await response.json();
            const page: DataSourcePage = this.config.mapResponse(body, this.currentCursor);

            this._hasMore = page.hasMore;
            this.currentCursor = page.nextCursor;

            if (page.items.length > 0) {
                this.onData?.(page.items);
            }
        } catch (err: any) {
            if (err?.name === 'AbortError') return;
            this.onError?.(err instanceof Error ? err : new Error(String(err)));
        } finally {
            this._isLoading = false;
            this.abortController = undefined;
            this.onLoadingChange?.(false);
        }
    }

    /** Busca todas as páginas sequencialmente */
    async fetchAll(): Promise<void> {
        try {
            while (this._hasMore) {
                await this.fetchNextPage();
            }
        } catch (error) {
            this.onError?.(error instanceof Error ? error : new Error(String(error)));
        }
        finally {
            this.onComplete?.();
        }
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
