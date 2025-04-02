import { FuseResult } from "fuse.js";
import { OptionItem } from "../plantae-filter-element";

export interface SearchEngine {
    search(term: string, token: number): void;
    update(collection: OptionItem[]): void;
    onResults?: (results: FuseResult<OptionItem>[] | OptionItem[], token: number) => void;
}
