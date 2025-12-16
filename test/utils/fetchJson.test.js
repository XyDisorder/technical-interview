const assert = require('assert');
const https = require('https');
const fetchJson = require('../../utils/fetchJson');

describe('fetchJson', () => {
  let originalGet;

  beforeEach(() => {
    originalGet = https.get;
  });

  afterEach(() => {
    https.get = originalGet;
  });

  it('should fetch and parse valid JSON', (done) => {
    https.get = (url, callback) => {
      const mockResponse = {
        on: (event, handler) => {
          if (event === 'data') {
            handler(JSON.stringify({ test: 'data' }));
          } else if (event === 'end') {
            handler();
          }
        },
      };
      callback(mockResponse);
      return {
        on: () => {},
      };
    };

    fetchJson('https://example.com/test.json')
      .then((result) => {
        assert.deepStrictEqual(result, { test: 'data' });
        done();
      })
      .catch(done);
  });

  it('should handle invalid JSON', (done) => {
    https.get = (url, callback) => {
      const mockResponse = {
        on: (event, handler) => {
          if (event === 'data') {
            handler('invalid json');
          } else if (event === 'end') {
            handler();
          }
        },
      };
      callback(mockResponse);
      return {
        on: () => {},
      };
    };

    fetchJson('https://example.com/invalid.json')
      .then(() => {
        done(new Error('Should have failed'));
      })
      .catch((err) => {
        assert.ok(err.message.includes('Failed to parse JSON'));
        done();
      });
  });

  it('should handle network errors', (done) => {
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

    fetchJson('https://example.com/error.json')
      .then(() => {
        done(new Error('Should have failed'));
      })
      .catch((err) => {
        assert.ok(err.message.includes('Failed to fetch'));
        done();
      });
  });
});
