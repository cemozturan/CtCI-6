import { isUniqueWithHashTable, isUniqueWithoutDataStructures } from './1';

describe('Ch1-Q1: IsUnique', function() {
  [
    '',
    ' ',
    'a',
    '123456789',
    '1q2w3e4r5t6y7u8i9ozasxdcfvgbhnjm[]#;'
  ].forEach(testCase => {
    it('returns true for unique strings', () => {
      let resultWithHashTable = isUniqueWithHashTable(testCase);
      let resultWithoutDataStructures = isUniqueWithoutDataStructures(testCase);
      expect(resultWithHashTable).toBe(true);
      expect(resultWithoutDataStructures).toBe(true);
    })
  });

  [
    '  ',
    'asdfghjka',
    'q2w3e4r5t6y75',
    'lkjlkj',
    'l#odfh#'
  ].forEach(testCase => {
    it('returns false for strings with duplicate characters', () => {
      let resultWithHashTable = isUniqueWithHashTable(testCase);
      let resultWithoutDataStructures = isUniqueWithoutDataStructures(testCase);
      expect(resultWithHashTable).toBe(false);
      expect(resultWithoutDataStructures).toBe(false);
    })
  });
})
