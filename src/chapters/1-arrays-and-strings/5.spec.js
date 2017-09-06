import isOneAway from './5';

describe('Ch1-Q5: One Away', function() {
  const oneAways = [
    ['kebab', 'kebab'],
    ['pale', 'ple'],
    ['pales', 'pale'],
    ['pale', 'bale'],
    ['pale', 'pxle'],
    ['pale', 'pate'],
    ['pale', 'pald'],
    ['answers', 'answer'],
    ['technology', 'etechnology']
  ];

  const nonOneAways = [
    ['pale', 'pl'],
    ['paless', 'pale'],
    ['pale', 'bales'],
    ['abcdefghiz', 'ihgfedcbaa'],
    ['1122334455667788', '9911223344556677'],
    ['45678', '1239'],
    ['abcd', 'dcba']
  ];

  oneAways.forEach(testCase => {
    it(`returns true for one aways: '${testCase[0]}' & '${testCase[1]}'`, function() {
      let result = isOneAway(testCase[0], testCase[1]);
      expect(result).toBe(true);
    });
  });

  nonOneAways.forEach(testCase => {
    it(`returns false for non-one aways: '${testCase[0]}' & '${testCase[1]}'`, function() {
      let result = isOneAway(testCase[0], testCase[1]);
      expect(result).toBe(false);
    });
  });
});
