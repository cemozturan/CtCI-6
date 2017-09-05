import isPalindromeOfPermutation from './4';

describe('Ch1-Q4: Palindrome Permutation', function() {
  const palindromes = [' ',
    '   ',
    'aabb',
    'ab a b',
    ' a b a b ',
    'sasadfgsadfghjk;hjk;sadfghjk;dfghjk;',
    'sa sadfgsadfgh jk;hjkz;sadfg hjk;dfghjk;',
    'asdasd',
    'ey edip adanada pide ye',
    'taco cat'
  ];

  const nonPalindromes = [
    '',
    null,
    undefined,
    'a b',
    'asda',
    'ey edip adanada kedi ye',
    'taco catp'
  ];

  palindromes.forEach(testCase => {
    it(`returns true for palindromes of permutations: '${testCase}'`, function() {
      let result = isPalindromeOfPermutation(testCase);
      expect(result).toBe(true);
    });
  });

  nonPalindromes.forEach(testCase => {
    it(`returns false for no palindromes of permutations: '${testCase}'`, function() {
      let result = isPalindromeOfPermutation(testCase);
      expect(result).toBe(false);
    });
  });
});
