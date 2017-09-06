import URLify from './3';

describe('Ch1-Q3: URLify', function() {
  const testCases = [
    { str: 'Mr Cem Kebabson', expected: 'Mr%20Cem%20Kebabson' },
    { str: '  Mr Cem Kebabson  ', expected: 'Mr%20Cem%20Kebabson' },
    { str: 'Mr  Cem  Kebabson', expected: 'Mr%20%20Cem%20%20Kebabson' },
    { str: '   ', expected: '' },
    { str: 'testing', expected: 'testing' },
    { str: 'test ing', expected: 'test%20ing' },
    { str: '%20 %20', expected: '%20%20%20' },
    { str: null, expected: null },
    { str: undefined, expected: undefined }
  ];

  testCases.forEach(testCase => {
    it(`returns URLified string: '${testCase.str}'`, function() {
      let result = URLify(testCase.str);
      expect(result).toBe(testCase.expected);
    })
  })
});
