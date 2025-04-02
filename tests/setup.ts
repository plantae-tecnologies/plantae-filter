import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Corrige eventuais warnings de ResizeObserver no jsdom
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}
(window as any).ResizeObserver = ResizeObserver;

globalThis.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/fake-worker-url');

// Mock do Worker
vi.stubGlobal('Worker', class {
    onmessage: ((this: Worker, ev: MessageEvent) => any) | null = null;
    postMessage = vi.fn();
    addEventListener = vi.fn();
    removeEventListener = vi.fn();
    terminate = vi.fn();
    onerror = vi.fn();
} as unknown as typeof Worker);

// Mock do Fuse.js
vi.mock('fuse.js', () => {
    return {
        default: class FuseMock {
            constructor() {}
            search = vi.fn(() => []);
            setCollection = vi.fn();
        }
    };
});

// Mock do Clusterize.js
vi.mock('clusterize.js', () => {
    return {
        default: class ClusterizeMock {
            constructor() {}
            update = vi.fn();
            clear = vi.fn();
            destroy = vi.fn();
        }
    };
});