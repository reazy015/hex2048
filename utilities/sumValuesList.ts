const reduceCallback = (previousValue: number, currentValue: number, currentIndex: number, array: number[]) => {
    if(currentIndex === 0) return array;

    if(array[currentIndex - 1] === 0) {
        array[currentIndex - 1] = currentValue;
        array.splice(currentIndex, 1);
        return array;
    }

    if(currentValue === array[currentIndex - 1]) {
        array[currentIndex - 1] = currentValue + array[currentIndex - 1];
        array.splice(currentIndex, 1);
        return array;
    }

    return array;
}

// TODO: get rid of reduce type hack
type ReduceCallbackType = (previousValue: number, currentValue: number, currentIndex: number, array: number[]) => number;

export const sumValuesList = (array: number[], length: number, isRightDirection?: boolean) => {
    let result: number[] = [];

    if (isRightDirection) {
        result = array.filter(item => item !== 0)
            .reduceRight(reduceCallback as unknown as ReduceCallbackType, 0) as unknown as number[];
        if(!result) result = [result as unknown as number];
        const difference = Array(length - result.length).fill(0);
        return difference.concat(result);
    }

    result = array.filter(item => item !== 0)
        .reduce(reduceCallback as unknown as ReduceCallbackType, 0) as unknown as number[];
    if(!result) result = [result as unknown as number];
    const difference = Array(length - result.length).fill(0);
    return result.concat(difference);
}

