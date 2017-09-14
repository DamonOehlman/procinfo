const assert = require('assert');
const { find, getDetails } = require('../');

describe('process detail', function() {
  let testPids = [];

  it('should be able to locate all the node processes', function(done) {
    find('node', function(err, results) {
      assert.ifError(err);
      assert(Array.from(results.keys()).length > 0, 'Could not locate any node processes');

      // save the test pids
      testPids = Array.from(results.keys());

      done();
    });
  });

  it('should be able to get details on the node processes', function(done) {
    getDetails(testPids, function(err, results) {
      assert.ifError(err);
      assert.equal(Array.from(results.keys()).length, testPids.length);

      done();
    });
  });
});
