const assert = require('assert');
const { mapGamesData } = require('../../utils/gameMapper');

describe('gameMapper', () => {
  describe('mapGamesData', () => {
    it('should return empty array for invalid input', () => {
      assert.deepStrictEqual(mapGamesData(null, 'ios'), []);
      assert.deepStrictEqual(mapGamesData(undefined, 'ios'), []);
      assert.deepStrictEqual(mapGamesData('invalid', 'ios'), []);
    });

    it('should map flat array of games', () => {
      const input = [
        {
          name: 'Game 1',
          id: '123',
          publisher_id: 'pub1',
          bundle_id: 'bundle1',
          version: '1.0.0',
          rank: 1,
        },
        {
          name: 'Game 2',
          app_id: '456',
          publisherId: 'pub2',
          bundleId: 'bundle2',
          appVersion: '2.0.0',
          rank: 2,
        },
      ];

      const result = mapGamesData(input, 'ios');

      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0].name, 'Game 1');
      assert.strictEqual(result[0].platform, 'ios');
      assert.strictEqual(result[0].storeId, '123');
      assert.strictEqual(result[0].publisherId, 'pub1');
      assert.strictEqual(result[0].bundleId, 'bundle1');
      assert.strictEqual(result[0].appVersion, '1.0.0');
      assert.strictEqual(result[0].rank, 1);
      assert.strictEqual(result[1].storeId, '456');
      assert.strictEqual(result[1].rank, 2);
    });

    it('should handle nested arrays (array of arrays)', () => {
      const input = [
        [
          { name: 'Game 1', id: '123', rank: 1 },
          { name: 'Game 1 Alt', id: '124', rank: 1 },
        ],
        [
          { name: 'Game 2', id: '456', rank: 2 },
        ],
      ];

      const result = mapGamesData(input, 'android');

      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0].name, 'Game 1');
      assert.strictEqual(result[0].platform, 'android');
      assert.strictEqual(result[0].storeId, '123');
      assert.strictEqual(result[1].name, 'Game 2');
    });

    it('should handle different field name variations', () => {
      const input = [
        { title: 'Game Title', app_id: '789', publisher: 'Pub', package: 'com.test', app_version: '3.0.0', rank: 1 },
      ];

      const result = mapGamesData(input, 'ios');

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, 'Game Title');
      assert.strictEqual(result[0].storeId, '789');
      assert.strictEqual(result[0].publisherId, 'Pub');
      assert.strictEqual(result[0].bundleId, 'com.test');
      assert.strictEqual(result[0].appVersion, '3.0.0');
    });

    it('should set default values for missing fields', () => {
      const input = [
        { name: 'Game', id: '123', rank: 1 },
      ];

      const result = mapGamesData(input, 'ios');

      assert.strictEqual(result[0].publisherId, '');
      assert.strictEqual(result[0].bundleId, '');
      assert.strictEqual(result[0].appVersion, '');
      assert.strictEqual(result[0].isPublished, true);
    });

    it('should preserve rank field', () => {
      const input = [
        { name: 'Game 1', id: '123', rank: 5 },
        { name: 'Game 2', id: '456', rank: 10 },
      ];

      const result = mapGamesData(input, 'ios');

      assert.strictEqual(result[0].rank, 5);
      assert.strictEqual(result[1].rank, 10);
    });
  });
});
