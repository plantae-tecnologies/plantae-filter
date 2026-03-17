import type { OptionItem } from '../components/plantae-filter-element';

/**
 * Resultado padronizado de uma página de dados.
 *
 * Duas formas:
 * - `hasMore`: paginação por cursor (total desconhecido)
 * - `totalItems`: paginação por total conhecido — habilita fetch paralelo com `concurrency > 1`
 */
export type DataSourcePage = {
    items: OptionItem[];
} & (
    | { nextCursor?: string | number; hasMore: boolean /** Cursor flexível: pode ser número de página, offset, cursor string, etc. */ }
    | { totalItems: number }
);

/** Configuração do DataSource remoto */
export interface DataSourceConfig {
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
