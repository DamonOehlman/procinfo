var assert = require('assert'),
    procinfo = require('../');

describe('process discovery', function() {
    it('should be able to locate all the node processes', function(done) {
        procinfo('node', function(err, results) {
            assert.ifError(err);
            assert(results.pids.length > 0, 'Could not locate any node processes');

            done();
        });
    });
});