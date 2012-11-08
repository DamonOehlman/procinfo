var assert = require('assert'),
    procinfo = require('../'),
    testPids = [];

describe('process detail', function() {
    it('should be able to locate all the node processes', function(done) {
        procinfo('node', function(err, results) {
            assert.ifError(err);
            assert(results.pids.length > 0, 'Could not locate any node processes');

            // save the test pids
            testPids = [].concat(results.pids);

            done();
        });
    });

    it('should be able to get details on the node processes', function(done) {
        procinfo(testPids, function(err, results) {
            assert.ifError(err);
            assert.equal(results.pids.length, testPids.length);

            done();
        });
    });
});