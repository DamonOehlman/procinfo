const exec = require('child_process').exec;
const searchers = {};
const reLineBreak = /\r?\n/;
const reFloat = /^(\d|\.)+$/;
const disallowedFields = ['pid', 'comm', 'command', 'args'];

const fields = [
  'state',
  'ppid',
  'time',
  'etime',
  'cpu',
  'pcpu',
  'pmem'
];

searchers.search = function(pattern, callback) {
  exec('ps ax -o pid,command', function(err, output) {
    const results = { pids: [] };
    if (err) {
      return callback(err);
    }

    // split the lines on a line break
    // and remove the header line
    const lines = output.split(reLineBreak).slice(1);

    // strip the pid from the lines
    const processes = lines.map(function(line) {
      return line.slice(6);
    });

    // iterate through the processes and look for a match against the pattern
    processes.forEach(function(command, index) {
      let pid;
      if (pattern.test(command)) {
        // extract the pid
        pid = parseInt(lines[index].slice(0, 5), 10);

        // add the pid to the pid array
        results.pids.push(pid);

        // add the pid detail
        results[pid] = {
          command: command
        };
      }
    });

    // sort the pids
    results.pids = results.pids.sort();

    // provide the results to the callback
    callback(null, results);
  });
};

searchers.detail = function(pids, callback) {
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
};

function procinfo(target, callback) {
  let searchType = 'regex';

  // if the target is an array or a number then go into pid detail search mode
  if (Array.isArray(target) || typeof target == 'number') {
    target = [].concat(target);
    searchType = 'detail';
  }
  else if (typeof target == 'string' || (target instanceof String)) {
    target = new RegExp(target, 'i');
  }

  (searchers[searchType] || searchers.search).call(this, target, callback);
}

// initialise the fields property on procinfo
Object.defineProperty(procinfo, 'fields', {
  get: function() {
    return [].concat(fields);
  },

  set: function(newFields) {
    // reset the fields
    fields = [];

    // iterate through the new fields and add acceptable fields
    newFields.forEach(function(newField) {
      if (disallowedFields.indexOf(newField) < 0) {
        fields[fields.length] = newField;
      }
    });
  }
});

module.exports = procinfo;
