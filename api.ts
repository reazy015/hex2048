import { Hex } from './enteties/Hex';

export const getValueForEmptyCells = async (cells: Hex[], radius: number, link) => {
    return await fetch(`${link}${radius}`, {
        method: 'POST',
        body: JSON.stringify(cells)
    }).then(data => data.json());
};
