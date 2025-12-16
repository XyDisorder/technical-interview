const assert = require('assert');
const { extractTopGamesByRank } = require('../../utils/topGamesExtractor');

describe('topGamesExtractor', () => {
  describe('extractTopGamesByRank', () => {
    it('should return empty array for invalid input', () => {
      assert.deepStrictEqual(extractTopGamesByRank(null, 100), []);
      assert.deepStrictEqual(extractTopGamesByRank(undefined, 100), []);
      assert.deepStrictEqual(extractTopGamesByRank([], 100), []);
    });

    it('should extract top N games sorted by rank', () => {
      const input = [
        [
          { name: 'Game 1', id: '1', rank: 1 },
        ],
        [
          { name: 'Game 2', id: '2', rank: 2 },
        ],
        [
          { name: 'Game 3', id: '3', rank: 3 },
        ],
        [
          { name: 'Game 4', id: '4', rank: 4 },
        ],
      ];

      const result = extractTopGamesByRank(input, 3);

      assert.strictEqual(result.length, 3);
      assert.strictEqual(result[0].rank, 1);
      assert.strictEqual(result[0].name, 'Game 1');
      assert.strictEqual(result[1].rank, 2);
      assert.strictEqual(result[1].name, 'Game 2');
      assert.strictEqual(result[2].rank, 3);
      assert.strictEqual(result[2].name, 'Game 3');
    });

    it('should filter out games without required fields', () => {
      const input = [
        [
          { name: 'Valid Game', id: '1', rank: 1 },
          { name: '', id: '2', rank: 2 }, // Missing name
          { name: 'No ID', rank: 3 }, // Missing id
          { name: 'No Rank', id: '4' }, // Missing rank
        ],
      ];

      const result = extractTopGamesByRank(input, 10);

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, 'Valid Game');
    });

    it('should handle different id field names', () => {
      const input = [
        [{ name: 'Game 1', app_id: '123', rank: 1 }],
        [{ name: 'Game 2', storeId: '456', rank: 2 }],
        [{ name: 'Game 3', store_id: '789', rank: 3 }],
      ];

      const result = extractTopGamesByRank(input, 3);

      assert.strictEqual(result.length, 3);
      assert.strictEqual(result[0].name, 'Game 1');
      assert.strictEqual(result[1].name, 'Game 2');
      assert.strictEqual(result[2].name, 'Game 3');
    });

    it('should respect the limit parameter', () => {
      const input = Array.from({ length: 200 }, (_, i) => [
        { name: `Game ${i + 1}`, id: `${i + 1}`, rank: i + 1 },
      ]);

      const result = extractTopGamesByRank(input, 100);

      assert.strictEqual(result.length, 100);
      assert.strictEqual(result[0].rank, 1);
      assert.strictEqual(result[99].rank, 100);
    });

    it('should handle games with same rank', () => {
      const input = [
        [{ name: 'Game 1', id: '1', rank: 1 }],
        [{ name: 'Game 2', id: '2', rank: 1 }],
        [{ name: 'Game 3', id: '3', rank: 2 }],
      ];

      const result = extractTopGamesByRank(input, 3);

      assert.strictEqual(result.length, 3);
      // Both rank 1 games should be included
      assert.ok(result.some((g) => g.name === 'Game 1'));
      assert.ok(result.some((g) => g.name === 'Game 2'));
    });
  });
});
