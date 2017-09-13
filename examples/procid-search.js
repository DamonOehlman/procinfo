const procinfo = require('..');

procinfo(1, function(err, results) {
  // output the pids that have been found (should be just pid: 1)
  console.log(results.pids);
 
  // now output the process details
  console.log(results[1]);
});
