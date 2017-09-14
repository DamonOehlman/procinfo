const { getDetails } = require('..');
const chalk = require('chalk');

getDetails([process.pid], function(err, results) {
  if (err) {
    return;
  }

  for (let [pid, details] of results) {
    console.log(`cpu usage for ${chalk.bold(details.get('comm'))} is ${chalk.yellow(details.get('cpu'))}`);
  }
});
