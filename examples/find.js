const { find } = require('..');
const chalk = require('chalk');

find('node', function(err, results) {
  if (err) {
    return console.log('error looking for node processes');
  }

  console.log(chalk.bold('matching node processes:'));
  for (let [ pid, command ] of results) {
    console.log(`${chalk.blue.bold(pid)}\n${chalk.grey(command)}\n`);
  }
});
