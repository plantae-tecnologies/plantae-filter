import Fuse, { FuseResult, IFuseOptions } from "fuse.js";
import { SearchEngine } from "./search-engine.interface";
import { OptionItem } from "../plantae-filter-element";

class FuseSearchEngine implements SearchEngine {
    private fuse: Fuse<OptionItem>;
    onResults?: (results: FuseResult<OptionItem>[] | OptionItem[], token: number) => void;

    constructor(collection: OptionItem[], options: IFuseOptions<OptionItem>) {
        this.fuse = new Fuse(collection, options);
    }

    search(term: string, token: number): void {
        const results = this.fuse.search(term);
        if (this.onResults) {
            this.onResults(results, token);
        }
    }

    update(collection: OptionItem[]): void {
        this.fuse.setCollection(collection);
    }
}

export default FuseSearchEngine;