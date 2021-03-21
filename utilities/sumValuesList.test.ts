import { sumValuesList } from './sumValuesList';

describe('sumValuesList', function () {
    const initialArray = [0, 2, 2, 2, 0, 4, 4];
    it('should return summed array with right reduce', () => {
        expect(sumValuesList(initialArray, initialArray.length, true))
            .toEqual([0, 0, 0, 0, 2, 4, 8 ])
    });
    it('should return summed array with left reduce', () => {
        expect(sumValuesList(initialArray, initialArray.length))
            .toEqual([ 4, 2, 8, 0, 0, 0, 0 ])
    });
});
