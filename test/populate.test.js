const request = require('supertest');
const assert = require('assert');
const https = require('https');
const db = require('../models');

// Ensure database is migrated before tests
before((done) => {
  db.sequelize.sync({ force: false })
    .then(() => done())
    .catch(done);
});

const app = require('../index');

const mockIosData = [
  [
    { name: 'iOS Game 1', id: 'ios1', rank: 1, publisher_id: 'pub1' },
  ],
  [
    { name: 'iOS Game 2', id: 'ios2', rank: 2, publisher_id: 'pub2' },
  ],
];

const mockAndroidData = [
  [
    { name: 'Android Game 1', id: 'and1', rank: 1, publisher_id: 'pub1' },
  ],
  [
    { name: 'Android Game 2', id: 'and2', rank: 2, publisher_id: 'pub2' },
  ],
];

describe('POST /api/games/populate', () => {
  let originalGet;

  beforeEach((done) => {
    // Clean database before each test to ensure isolation
    db.Game.destroy({ where: {}, force: true })
      .then(() => {
        originalGet = https.get;
        done();
      })
      .catch(done);
  });

  afterEach((done) => {
    // Clean up after each test to not interfere with other tests
    db.Game.destroy({ where: {}, force: true })
      .then(() => {
        https.get = originalGet;
        done();
      })
      .catch(done);
  });

  it('should populate games successfully', (done) => {
    let callCount = 0;
    https.get = (url, callback) => {
      const mockResponse = {
        on: (event, handler) => {
          if (event === 'data') {
            const data = callCount === 0 ? mockIosData : mockAndroidData;
            handler(JSON.stringify(data));
            callCount += 1;
          } else if (event === 'end') {
            handler();
          }
        },
      };
      callback(mockResponse);
      return { on: () => {} };
    };

    request(app)
      .post('/api/games/populate')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, result) => {
        if (err) return done(err);
        assert.ok(result.body.message);
        assert.ok(result.body.count);
        assert.strictEqual(typeof result.body.count, 'number');
        return done();
      });
  });

  it('should return 400 if no games found', (done) => {
    https.get = (url, callback) => {
      const mockResponse = {
        on: (event, handler) => {
          if (event === 'data') {
            handler(JSON.stringify([]));
          } else if (event === 'end') {
            handler();
          }
        },
      };
      callback(mockResponse);
      return { on: () => {} };
    };

    request(app)
      .post('/api/games/populate')
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, result) => {
        if (err) return done(err);
        assert.ok(result.body.error);
        return done();
      });
  });

  it('should handle fetch errors gracefully', (done) => {
    https.get = () => {
      const mockRequest = {
        on: (event, handler) => {
          if (event === 'error') {
            handler(new Error('Network error'));
          }
        },
      };
      return mockRequest;
    };

    request(app)
      .post('/api/games/populate')
      .set('Accept', 'application/json')
      .expect(500)
      .end((err, result) => {
        if (err) return done(err);
        assert.ok(result.body.error);
        return done();
      });
  });
});
