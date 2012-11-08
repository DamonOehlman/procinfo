# procinfo

This module is a simple module that is designed to provide process information on *nix systems.  It only exists because I couldn't find an existing module that suited my particular use case.  Unlike the other modules `procinfo` is designed to give you one-shot information on a process and leaves scheduling / monitoring to you.

<a href="http://travis-ci.org/#!/DamonOehlman/procinfo"><img src="https://secure.travis-ci.org/DamonOehlman/procinfo.png" alt="Build Status"></a>

## Usage

Using `procinfo` is simple once you understand that `procinfo` has two modes of operation:

- search
- detail

Search mode is used when proc info is provided either a string or regular expression to search for in the command name output of the `ps` system command.  For instance:

```js
procinfo('node', function(err, results) {
    // output the pids that have been found matching node (case insensitive)
    console.log(results.pids);

    // now output the basic process details for the first process
    console.log(results[results.pids[0]]);
});
```

Using search mode only provides limited information on the process (essentially just the `pid` and the `command` used to initiate the process).  For more detailed information we call `procinfo` providing either a number or an array of pids to locate:

```js
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

__NOTE__: The `args` value is different from the default ps `args` field definition, whereby it includes __just__ the command-line arguments and not the original command.  Additionally, the arguments are provided in an array rather than a string.  This has been done because the `ps` implementation of `args` and `command` producing the same output seems redundant.

If you would prefer a different set of `ps` fields then you can set the `procinfo.fields` property to match your requirements:

```js
procinfo.fields = ['state', 'etime'];
```
