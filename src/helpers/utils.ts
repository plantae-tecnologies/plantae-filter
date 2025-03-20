export function debounce<T extends (...args: any[]) => void>(fn: T, delay = 300): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// Função auxiliar para mesclar intervalos sobrepostos (fuse.js)
export function mergeOverlapping(indices: readonly [number, number][]): [number, number][] {
    const sorted = [...indices].sort((a, b) => a[0] - b[0]);
    const merged: [number, number][] = [];

    for (const [start, end] of sorted) {
        if (!merged.length) {
            merged.push([start, end]);
        } else {
            const last = merged[merged.length - 1];
            if (start <= last[1] + 1) {
                last[1] = Math.max(last[1], end);
            } else {
                merged.push([start, end]);
            }
        }
    }

    return merged;
}