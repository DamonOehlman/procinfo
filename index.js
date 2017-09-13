/**
  # procinfo

  This module is a simple module that is designed to provide process information on *nix systems.  It only exists
  because I couldn't find an existing module that suited my particular use case.  Unlike the other modules
  `procinfo` is designed to give you one-shot information on a process and leaves scheduling / monitoring to you.

  ## Usage

  Using `procinfo` is simple once you understand that `procinfo` has two modes of operation:

  - search
  - detail

  Search mode is used when proc info is provided either a string or regular expression to search for in the command
  name output of the `ps` system command.  For instance:

  <<< examples/find.js

  Using search mode only provides limited information on the process (essentially just the `pid` and the `command` used
  to initiate the process).  For more detailed information we call `procinfo` providing either a number or an
  array of pids to locate:

  <<< examples/get-details.js

  At present (probably likely to change) the following fields are included in the default process output:

  - `state`
  - `ppid`
  - `time`
  - `etime`
  - `cpu`
  - `pcpu`
  - `pmem`
  - `command`
  - `comm`
  - `args`

  __NOTE__: The `args` value is different from the default ps `args` field definition, whereby it includes __just__ the command-line
  arguments and not the original command.  Additionally, the arguments are provided in an array rather than a string.
  This has been done because the `ps` implementation of `args` and `command` producing the same output seems redundant.

  If you would prefer a different set of `ps` fields then you can set the `procinfo.fields` property to match
  your requirements:

  ```js
  procinfo.fields = ['state', 'etime'];
  ```
**/

const exec = require('child_process').exec;
const searchers = {};
const reLineBreak = /\r?\n/;
const reFloat = /^(\d|\.)+$/;
const reCommandLine = /^\s*([0-9]+)\s+(.*)$/;
const disallowedFields = ['pid', 'comm', 'command', 'args'];

const DEFAULT_FIELDS = [
  'state',
  'ppid',
  'time',
  'etime',
  'cpu',
  'pcpu',
  'pmem'
];

function find(pattern, callback) {
  if (!(pattern instanceof RegExp)) {
    pattern = new RegExp(pattern, 'i');
  }

  exec('ps ax -o pid,command', function(err, output) {
    if (err) {
      return callback(err);
    }

    const lines = output.split(reLineBreak).slice(1);

    // find the results where:
    // 1. A result is a valid line formatted as <pid> <command>
    // 2. <command> matches the pattern specified
    const results = new Map(lines.map(line => {
      const match = reCommandLine.exec(line);

      return match && pattern.test(match[2]) && [
        parseInt(match[1], 10),
        match[2]
      ];
    }).filter(Boolean));

    callback(null, results);
  });
}

function getDetails(opts, callback) {
  const pids = (opts || {}).pids || [];
  const fields = (opts || {}).fields || DEFAULT_FIELDS;
  const queryFields = ['pid'].concat(fields).concat(['comm', 'args']);
  const argsFieldIdx = queryFields.length - 1;

  exec('ps -o ' + queryFields.join(',') + ' -p' + pids.join(','), function(err, stdout) {
    const results = { pids: [] };
    if (err) {
      return callback(err);
    }

    // iterate through the valid output lines and process the output
    stdout.split(reLineBreak).slice(1).forEach(function(line) {
      const fields = line.trim().split(/\s+/);
      const pid = parseInt(fields[0], 10);
      const data = {};

      // if we have a valid pid, then process the line
      if (pid) {
        // concat any trailing args into the final arg field
        fields[argsFieldIdx] = fields.splice(argsFieldIdx + 1);

        // map the fields onto the object data
        queryFields.slice(1).forEach(function(fieldName, index) {
          const rawValue = fields[index + 1];
          data[fieldName] = reFloat.test(rawValue) ? parseFloat(rawValue) : rawValue;
        });

        // calculate the command field
        data.command = data.comm + ' ' + data.args.join(' ');

        // add the pid data to the results
        results[pid] = data;
        results.pids.push(pid);
      }
    });

    // fire the callback
    callback(null, results);
  });
}

module.exports = { find, getDetails };
