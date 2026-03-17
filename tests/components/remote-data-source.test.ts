import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { RemoteDataSource } from '../../src/components/data-source/remote-data-source';
import type { DataSourceConfig } from '../../src/types/data-source';

function createMockConfig(overrides: Partial<DataSourceConfig> = {}): DataSourceConfig {
    return {
        url: 'https://api.example.com/items',
        pageSize: 2,
        mapResponse: (body) => ({
            items: body.data.map((d: any) => ({ value: d.id, text: d.name })),
            hasMore: body.hasMore,
            nextCursor: body.nextPage,
        }),
        ...overrides,
    };
}

describe('RemoteDataSource', () => {
    let fetchSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        fetchSpy = vi.fn();
        vi.stubGlobal('fetch', fetchSpy);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should fetch a single page and deliver items via onData', async () => {
        fetchSpy.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: [{ id: '1', name: 'Apple' }, { id: '2', name: 'Banana' }],
                hasMore: false,
                nextPage: null,
            }),
        });

        const config = createMockConfig();
        const ds = new RemoteDataSource(config);

        const receivedItems: any[] = [];
        ds.onData = (items) => receivedItems.push(...items);

        await ds.fetchAll();

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(receivedItems).toHaveLength(2);
        expect(receivedItems[0]).toEqual({ value: '1', text: 'Apple' });
        expect(ds.hasMore).toBe(false);
    });

    it('should fetch all pages sequentially with fetchAll', async () => {
        fetchSpy
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ id: '1', name: 'Apple' }],
                    hasMore: true,
                    nextPage: 2,
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ id: '2', name: 'Banana' }],
                    hasMore: true,
                    nextPage: 3,
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ id: '3', name: 'Cherry' }],
                    hasMore: false,
                    nextPage: null,
                }),
            });

        const config = createMockConfig();
        const ds = new RemoteDataSource(config);

        const receivedItems: any[] = [];
        ds.onData = (items) => receivedItems.push(...items);

        const onComplete = vi.fn();
        ds.onComplete = onComplete;

        await ds.fetchAll();

        expect(fetchSpy).toHaveBeenCalledTimes(3);
        expect(receivedItems).toHaveLength(3);
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(ds.hasMore).toBe(false);
    });

    it('should use default page params (page/per_page)', async () => {
        fetchSpy.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: [],
                hasMore: false,
                nextPage: null,
            }),
        });

        const config = createMockConfig();
        const ds = new RemoteDataSource(config);
        await ds.fetchAll();

        const calledUrl = fetchSpy.mock.calls[0][0] as string;
        const url = new URL(calledUrl);
        expect(url.searchParams.get('page')).toBe('1');
        expect(url.searchParams.get('per_page')).toBe('2');
    });

    it('should use custom buildPageParams', async () => {
        fetchSpy.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: [{ id: '1', name: 'Apple' }],
                hasMore: true,
                nextPage: 'cursor_abc',
            }),
        }).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: [{ id: '2', name: 'Banana' }],
                hasMore: false,
                nextPage: null,
            }),
        });

        const config = createMockConfig({
            buildPageParams: (cursor, pageSize) => ({
                cursor: cursor?.toString() ?? '',
                limit: pageSize.toString(),
            }),
        });

        const ds = new RemoteDataSource(config);
        ds.onData = () => {};

        await ds.fetchAll();

        const firstUrl = new URL(fetchSpy.mock.calls[0][0] as string);
        expect(firstUrl.searchParams.get('cursor')).toBe('');
        expect(firstUrl.searchParams.get('limit')).toBe('2');

        const secondUrl = new URL(fetchSpy.mock.calls[1][0] as string);
        expect(secondUrl.searchParams.get('cursor')).toBe('cursor_abc');
    });

    it('should merge static params with pagination params', async () => {
        fetchSpy.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: [], hasMore: false, nextPage: null }),
        });

        const config = createMockConfig({
            params: { category: 'fruit', sort: 'name' },
        });

        const ds = new RemoteDataSource(config);
        await ds.fetchAll();

        const calledUrl = new URL(fetchSpy.mock.calls[0][0] as string);
        expect(calledUrl.searchParams.get('category')).toBe('fruit');
        expect(calledUrl.searchParams.get('sort')).toBe('name');
        expect(calledUrl.searchParams.get('page')).toBe('1');
    });

    it('should send POST request with params in body', async () => {
        fetchSpy.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: [], hasMore: false, nextPage: null }),
        });

        const config = createMockConfig({
            method: 'POST',
            params: { filter: 'active' },
        });

        const ds = new RemoteDataSource(config);
        await ds.fetchAll();

        expect(fetchSpy.mock.calls[0][0]).toBe('https://api.example.com/items');
        const requestInit = fetchSpy.mock.calls[0][1];
        expect(requestInit.method).toBe('POST');

        const body = JSON.parse(requestInit.body);
        expect(body.filter).toBe('active');
        expect(body.page).toBe('1');
    });

    it('should include custom headers', async () => {
        fetchSpy.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: [], hasMore: false, nextPage: null }),
        });

        const config = createMockConfig({
            headers: { Authorization: 'Bearer token123' },
        });

        const ds = new RemoteDataSource(config);
        await ds.fetchAll();

        const requestInit = fetchSpy.mock.calls[0][1];
        expect(requestInit.headers.Authorization).toBe('Bearer token123');
    });

    it('should call onError on HTTP error', async () => {
        fetchSpy.mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
        });

        const config = createMockConfig();
        const ds = new RemoteDataSource(config);

        const onError = vi.fn();
        ds.onError = onError;

        await ds.fetchAll();

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError.mock.calls[0][0].message).toContain('500');
    });

    it('should call onError on network failure', async () => {
        fetchSpy.mockRejectedValueOnce(new Error('Network error'));

        const config = createMockConfig();
        const ds = new RemoteDataSource(config);

        const onError = vi.fn();
        ds.onError = onError;

        await ds.fetchAll();

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError.mock.calls[0][0].message).toBe('Network error');
    });

    it('should not fetch if hasMore is false', async () => {
        fetchSpy.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: [], hasMore: false, nextPage: null }),
        });

        const config = createMockConfig();
        const ds = new RemoteDataSource(config);

        await ds.fetchAll();
        await ds.fetchAll(); // hasMore is false, loop does not execute

        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('should report loading state changes', async () => {
        fetchSpy.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: [], hasMore: false, nextPage: null }),
        });

        const config = createMockConfig();
        const ds = new RemoteDataSource(config);

        const loadingStates: boolean[] = [];
        ds.onLoadingChange = (isLoading) => loadingStates.push(isLoading);

        await ds.fetchAll();

        expect(loadingStates).toEqual([true, false]);
    });

    it('should reset pagination state', async () => {
        fetchSpy
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ id: '1', name: 'Apple' }],
                    hasMore: false,
                    nextPage: null,
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ id: '2', name: 'Banana' }],
                    hasMore: false,
                    nextPage: null,
                }),
            });

        const config = createMockConfig();
        const ds = new RemoteDataSource(config);
        ds.onData = () => {};

        await ds.fetchAll();
        expect(ds.hasMore).toBe(false);

        ds.reset();
        expect(ds.hasMore).toBe(true);

        await ds.fetchAll();
        expect(fetchSpy).toHaveBeenCalledTimes(2);
    });
});

describe('RemoteDataSource – parallel fetching', () => {
    let fetchSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        fetchSpy = vi.fn();
        vi.stubGlobal('fetch', fetchSpy);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should fetch remaining pages in parallel when totalItems is provided', async () => {
        // 5 items total, pageSize 2 → 3 pages
        fetchSpy
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ id: '1', name: 'Apple' }, { id: '2', name: 'Banana' }],
                    hasMore: true,
                    nextPage: 2,
                    total: 5,
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ id: '3', name: 'Cherry' }, { id: '4', name: 'Date' }],
                    hasMore: true,
                    nextPage: 3,
                    total: 5,
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ id: '5', name: 'Elderberry' }],
                    hasMore: false,
                    nextPage: null,
                    total: 5,
                }),
            });

        const config = createMockConfig({
            pageSize: 2,
            concurrency: 3,
            mapResponse: (body) => ({
                items: body.data.map((d: any) => ({ value: d.id, text: d.name })),
                hasMore: body.hasMore,
                nextCursor: body.nextPage,
                totalItems: body.total,
            }),
        });

        const ds = new RemoteDataSource(config);
        const receivedItems: any[] = [];
        ds.onData = (items) => receivedItems.push(...items);

        const onComplete = vi.fn();
        ds.onComplete = onComplete;

        await ds.fetchAll();

        expect(fetchSpy).toHaveBeenCalledTimes(3);
        expect(receivedItems).toHaveLength(5);
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(ds.hasMore).toBe(false);
    });

    it('should respect concurrency limit and fetch in batches', async () => {
        // 7 items, pageSize 1 → 7 pages; concurrency 2 → batches: [1], [2,3], [4,5], [6,7]
        const callOrder: number[] = [];
        let callIndex = 0;

        fetchSpy.mockImplementation(async () => {
            const idx = ++callIndex;
            callOrder.push(idx);
            return {
                ok: true,
                json: async () => ({
                    data: [{ id: String(idx), name: `Item${idx}` }],
                    hasMore: idx < 7,
                    nextPage: idx < 7 ? idx + 1 : null,
                    total: 7,
                }),
            };
        });

        const config = createMockConfig({
            pageSize: 1,
            concurrency: 2,
            mapResponse: (body) => ({
                items: body.data.map((d: any) => ({ value: d.id, text: d.name })),
                hasMore: body.hasMore,
                nextCursor: body.nextPage,
                totalItems: body.total,
            }),
        });

        const ds = new RemoteDataSource(config);
        const receivedItems: any[] = [];
        ds.onData = (items) => receivedItems.push(...items);

        await ds.fetchAll();

        expect(fetchSpy).toHaveBeenCalledTimes(7);
        expect(receivedItems).toHaveLength(7);
    });

    it('should fallback to sequential when totalItems is not provided', async () => {
        fetchSpy
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ id: '1', name: 'Apple' }],
                    hasMore: true,
                    nextPage: 2,
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ id: '2', name: 'Banana' }],
                    hasMore: false,
                    nextPage: null,
                }),
            });

        const config = createMockConfig({
            concurrency: 3,
        });

        const ds = new RemoteDataSource(config);
        const receivedItems: any[] = [];
        ds.onData = (items) => receivedItems.push(...items);

        await ds.fetchAll();

        expect(fetchSpy).toHaveBeenCalledTimes(2);
        expect(receivedItems).toHaveLength(2);
    });

    it('should fallback to sequential when using cursor-based pagination (hasMore)', async () => {
        fetchSpy
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ id: '1', name: 'Apple' }],
                    hasMore: true,
                    nextPage: 'cursor_abc',
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ id: '2', name: 'Banana' }],
                    hasMore: true,
                    nextPage: 'cursor_def',
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ id: '3', name: 'Cherry' }],
                    hasMore: false,
                    nextPage: null,
                }),
            });

        const config = createMockConfig({
            concurrency: 3,
            mapResponse: (body) => ({
                items: body.data.map((d: any) => ({ value: d.id, text: d.name })),
                hasMore: body.hasMore,
                nextCursor: body.nextPage,
            }),
        });

        const ds = new RemoteDataSource(config);
        const receivedItems: any[] = [];
        ds.onData = (items) => receivedItems.push(...items);

        await ds.fetchAll();

        // hasMore variant always fetches sequentially, regardless of concurrency
        expect(fetchSpy).toHaveBeenCalledTimes(3);
        expect(receivedItems).toHaveLength(3);
    });

    it('should handle single-page response with concurrency', async () => {
        fetchSpy.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                data: [{ id: '1', name: 'Apple' }],
                hasMore: false,
                nextPage: null,
                total: 1,
            }),
        });

        const config = createMockConfig({
            concurrency: 5,
            mapResponse: (body) => ({
                items: body.data.map((d: any) => ({ value: d.id, text: d.name })),
                hasMore: body.hasMore,
                nextCursor: body.nextPage,
                totalItems: body.total,
            }),
        });

        const ds = new RemoteDataSource(config);
        const receivedItems: any[] = [];
        ds.onData = (items) => receivedItems.push(...items);

        await ds.fetchAll();

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(receivedItems).toHaveLength(1);
    });

    it('should call onError when a parallel page fails', async () => {
        fetchSpy
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ id: '1', name: 'Apple' }],
                    hasMore: true,
                    nextPage: 2,
                    total: 4,
                }),
            })
            .mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
            });

        const config = createMockConfig({
            pageSize: 2,
            concurrency: 3,
            mapResponse: (body) => ({
                items: body.data.map((d: any) => ({ value: d.id, text: d.name })),
                hasMore: body.hasMore,
                nextCursor: body.nextPage,
                totalItems: body.total,
            }),
        });

        const ds = new RemoteDataSource(config);
        ds.onData = () => {};

        const onError = vi.fn();
        ds.onError = onError;

        await ds.fetchAll();

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError.mock.calls[0][0].message).toContain('500');
    });

    it('should report loading state correctly during parallel fetch', async () => {
        fetchSpy
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ id: '1', name: 'Apple' }],
                    hasMore: true,
                    nextPage: 2,
                    total: 3,
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    data: [{ id: '2', name: 'Banana' }],
                    hasMore: false,
                    nextPage: null,
                    total: 3,
                }),
            });

        const config = createMockConfig({
            pageSize: 2,
            concurrency: 2,
            mapResponse: (body) => ({
                items: body.data.map((d: any) => ({ value: d.id, text: d.name })),
                hasMore: body.hasMore,
                nextCursor: body.nextPage,
                totalItems: body.total,
            }),
        });

        const ds = new RemoteDataSource(config);
        ds.onData = () => {};

        const loadingStates: boolean[] = [];
        ds.onLoadingChange = (isLoading) => loadingStates.push(isLoading);

        await ds.fetchAll();

        // Should have exactly one true (start) and one false (end)
        expect(loadingStates).toEqual([true, false]);
    });
});
