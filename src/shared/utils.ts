export const asyncIteratorToArray = async <T>(iterator: AsyncIterable<T>): Promise<T[]> => {
    const array: T[] = [];
    for await (const item of iterator) {
        array.push(item);
    }
    return array;
};



export const nullifyUndefined = (obj: Record<string, any>) => {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, v ?? null])
    );
};

