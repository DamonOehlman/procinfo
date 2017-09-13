
# procinfo

This module is a simple module that is designed to provide process information on *nix systems.  It only exists
because I couldn't find an existing module that suited my particular use case.  Unlike the other modules
`procinfo` is designed to give you one-shot information on a process and leaves scheduling / monitoring to you.


[![NPM](https://nodei.co/npm/procinfo.png)](https://nodei.co/npm/procinfo/)

[![Build Status](https://api.travis-ci.org/DamonOehlman/procinfo.svg?branch=master)](https://travis-ci.org/DamonOehlman/procinfo) [![bitHound Score](https://www.bithound.io/github/DamonOehlman/procinfo/badges/score.svg)](https://www.bithound.io/github/DamonOehlman/procinfo) 

## Usage

Using `procinfo` is simple once you understand that `procinfo` has two modes of operation:

- search
- detail

Search mode is used when proc info is provided either a string or regular expression to search for in the command
name output of the `ps` system command.  For instance:

```js
const procinfo = require('procinfo');

procinfo('node', function(err, results) {
  // output the pids that have been found matching node (case insensitive)
  console.log(results.pids);

  // now output the basic process details for the first process
  console.log(results[results.pids[0]]);
});

```

Using search mode only provides limited information on the process (essentially just the `pid` and the `command` used
to initiate the process).  For more detailed information we call `procinfo` providing either a number or an
array of pids to locate:

```js
const procinfo = require('procinfo');

procinfo(1, function(err, results) {
  // output the pids that have been found (should be just pid: 1)
  console.log(results.pids);
 
  // now output the process details
  console.log(results[1]);
});

```

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

## License(s)

### MIT

Copyright (c) 2017 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
