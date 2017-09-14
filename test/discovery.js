const assert = require('assert');
const { find } = require('../');

describe('process discovery', function() {
  it('should be able to locate all the node processes', function(done) {
    find('node', function(err, results) {
      assert.ifError(err);
      assert(Array.from(results.keys()).length > 0, 'Could not locate any node processes');

      done();
    });
  });
});
