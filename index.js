var exec = require('child_process').exec,
    searchers = {},
    reLineBreak = /\r?\n/;

searchers.search = function(pattern, callback) {
    exec('ps ax -o pid,command', function(err, output) {
        var lines, processes, results = [];

        if (err) return callback(err);

        // split the lines on a line break
        // and remove the header line
        lines = output.split(reLineBreak).slice(1);

        // strip the pid from the lines
        processes = lines.map(function(line) {
            return line.slice(6);
        });

        // iterate through the processes and look for a match against the pattern
        processes.forEach(function(command, index) {
            if (pattern.test(command)) {
                results.push({
                    pid: parseInt(lines[index].slice(0, 5), 10),
                    command: command
                });
            }
        });

        callback(null, results);
    });
};

searchers.detail = function(pids, callback) {

};

function procinfo(target, callback) {
    var searchType = 'regex';

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

module.exports = procinfo;