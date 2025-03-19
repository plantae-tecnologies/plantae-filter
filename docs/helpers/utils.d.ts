export declare function debounce<T extends (...args: any[]) => void>(fn: T, delay?: number): (...args: Parameters<T>) => void;
