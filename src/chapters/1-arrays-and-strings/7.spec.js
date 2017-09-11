import rotateMatrix from './7';

describe('Ch1-Q7: Rotate Matrix', function() {
  const matrices = [
    {
      original: [
        [1]
      ],
      rotated: [
        [1]
      ]
    },
    {
      original: [
        [1,2],
        [3,4]
      ],
      rotated: [
        [3,1],
        [4,2]
      ]
    },
    {
      original: [
        [1,2,3],
        [4,5,6],
        [7,8,9]
      ],
      rotated: [
        [7,4,1],
        [8,5,2],
        [9,6,3]
      ]
    },
    {
      original: [
        [1,2,3,4],
        [5,6,7,8],
        [9,10,11,12],
        [13,14,15,16]
      ],
      rotated: [
        [13,9,5,1],
        [14,10,6,2],
        [15,11,7,3],
        [16,12,8,4]
      ]
    },
  ];

  matrices.forEach(testCase => {
    it("returns a 90 degree rotated matrix", function() {
      const result = rotateMatrix(testCase.original);
      expect(result).toEqual(testCase.rotated);
    });
  })
});
