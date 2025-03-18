declare module 'clusterize.js' {
    interface ClusterizeOptions {
        rows: string[];
        scrollElem: HTMLElement;
        contentElem: HTMLElement;
        tag?: string;
        no_data_text?: string;
        callbacks?: {
            clusterWillChange?: () => void;
            clusterChanged?: () => void;
        };
    }

    export default class Clusterize {
        constructor(options: ClusterizeOptions);
        clear(): void;
        destroy(clean?: boolean): void;
        getRowsAmount(): number;
        update(rows: string[]): void;
        append(rows: string[]): void;
    }
}
