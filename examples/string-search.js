const { find } = require('..');

find('node', function(err, results) {
  // output the pids that have been found matching node (case insensitive)
  console.log(results.pids);

  // now output the basic process details for the first process
  console.log(results[results.pids[0]]);
});
