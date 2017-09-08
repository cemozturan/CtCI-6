import stringCompression from './6';

describe('Ch1-Q6: String Compression', function() {
  const notCompressed = [
    '',
    null,
    undefined,
    'a',
    'aa',
    'abc',
    'aabbcc',
    'ababababccab',
    'aaab',
    'abcABCddd'
  ]

  notCompressed.forEach(testCase => {
    it(`returns input string where compression doesn't use less space: '${testCase}'`, function() {
      let result = stringCompression(testCase);
      expect(result).toBe(testCase);
    });
  });

  const compressed = [
    { arg: 'aaa', expected: '3a' },
    { arg: 'bbbbbb', expected: '6b' },
    { arg: 'abbbbbbc', expected: '1a6b1c' },
    { arg: 'aaabccc', expected: '3a1b3c' },
    { arg: 'hhellllllllooooo!', expected: '2h1e8l5o1!' },
    { arg: 'woorrrllllddddd', expected: '1w2o3r4l5d' }
  ];

  compressed.forEach(({arg, expected}) => {
    it(`returns ${expected} with string ${arg}`, function() {
      let result = stringCompression(arg);
      expect(result).toBe(expected);
    });
  });
});
