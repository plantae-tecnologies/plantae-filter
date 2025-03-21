import Fuse from 'fuse.js';
import type { IFuseOptions } from 'fuse.js';

let fuse: Fuse<any>;

self.onmessage = (e: MessageEvent) => {
    const { type, payload } = e.data;

    if (type === 'init') {
        fuse = new Fuse(payload.collection, payload.options as IFuseOptions<any>);
        self.postMessage({ type: 'ready' });
    }

    if (type === 'update') {
        fuse.setCollection(payload.collection);
        self.postMessage({ type: 'updated' });
    }

    if (type === 'search') {
        const results = fuse.search(payload.term);
        self.postMessage({ type: 'results', results, token: payload.token });
    }
};