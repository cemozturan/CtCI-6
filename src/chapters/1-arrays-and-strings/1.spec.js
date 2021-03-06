import { isUniqueWithHashTable, isUniqueWithoutDataStructures } from './1';

describe('Ch1-Q1: IsUnique', function() {
  const uniqueCases = [
    '',
    ' ',
    'a',
    '123456789',
    '1q2w3e4r5t6y7u8i9ozasxdcfvgbhnjm[]#;'
  ];

  const nonUniqueCases = [
    '  ',
    'asdfghjka',
    'q2w3e4r5t6y75',
    'lkjlkj',
    'l#odfh#'
  ];

  uniqueCases.forEach(testCase => {
    it(`returns true for unique strings using a hash table: '${testCase}'`, () => {
      let result = isUniqueWithHashTable(testCase);
      expect(result).toBe(true);
    });

    it(`returns true for unique strings without using a data structure: '${testCase}'`, () => {
      let result = isUniqueWithoutDataStructures(testCase);
      expect(result).toBe(true);
    });
  });

  nonUniqueCases.forEach(testCase => {
    it(`returns false for strings with duplicate characters using a hash table: '${testCase}'`, () => {
      let result = isUniqueWithHashTable(testCase);
      expect(result).toBe(false);
    });

    it(`returns false for strings with duplicate characters without using a data structure: '${testCase}'`, () => {
      let result = isUniqueWithoutDataStructures(testCase);
      expect(result).toBe(false);
    });
  });
})
