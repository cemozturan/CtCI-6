import { isPermutationWithHashTable, isPermutationWithoutDataStructure } from './2';

describe('Ch2-Q2: IsPermutation', function() {
  const permutationCases = [
    ['', ''],
    [' ', ' '],
    ['qwertyui', 'qweriuyt'],
    ['ababababa', 'bbaabaaab'],
    ['123123456789', '123456789123'],
    ['][p;]12345zxcvb', 'bz;v2xc]134p[5]'],
  ];

  const nonPermutationCases = [
    ['', ' '],
    ['qwerdyui', 'qweriuyt'],
    ['babababab', 'bbaabaaab'],
    ['12312456789', '12345678123'],
    ['][p;]123456zxcvb', 'bz;v2xc]134p[5]'],
  ];

  permutationCases.forEach(testCase => {
    it(`returns true for strings that are permutations, using a hash table: '${testCase[0]}' & '${testCase[1]}'`, function() {
      let result = isPermutationWithHashTable(testCase[0], testCase[1]);
      expect(result).toBe(true);
    });
  });

  permutationCases.forEach(testCase => {
    it(`returns true for strings that are permutations, without using a data structure: '${testCase[0]}' & '${testCase[1]}'`, function() {
      let result = isPermutationWithoutDataStructure(testCase[0], testCase[1]);
      expect(result).toBe(true);
    });
  });

  nonPermutationCases.forEach(testCase => {
    it(`returns false for strings that are not permutations, using a hash table: '${testCase[0]}' & '${testCase[1]}'`, function() {
      let result = isPermutationWithHashTable(testCase[0], testCase[1]);
      expect(result).toBe(false);
    });
  });

  nonPermutationCases.forEach(testCase => {
    it(`returns false for strings that are not permutations, without using a data structure: '${testCase[0]}' & '${testCase[1]}'`, function() {
      let result = isPermutationWithoutDataStructure(testCase[0], testCase[1]);
      expect(result).toBe(false);
    });
  });
})
