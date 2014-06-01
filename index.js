var Lazy = require('lazy');
var fs = require('fs');

var err = process.stderr.write.bind(process.stderr);
var out = process.stdout.write.bind(process.stdout);

var COLORS = {
    red         : "\x1b[31m",
    green       : "\x1b[32m",
    yellow      : "\x1b[33m",
    blue        : "\x1b[34m",
    magenta     : "\x1b[35m",
    cyan        : "\x1b[36m",
    reset       : "\x1b[0m"
};

var options = require('docopt').docopt(fs.readFileSync(__dirname + '/usage.txt', 'utf8'), {
    help        : true,
    version     : require('./package.json').version
});

var config = {
    cycle   : options['--colors'].split(',').map(function(c) { return c.trim().toLowerCase(); }),
    reset   : !options['--no-reset']
};

if (options['--lines']) {

    config.mode = 'lines';
    config.lines = parseInt(options['--lines'], 10);
    checkNumber(config.lines, 'LINES');

} else if (options['--time']) {

    config.mode = 'time';
    config.period = parseFloat(options['--time']);
    checkNumber(config.period, 'TIME');

} else {
    
    config.mode = 'delay';
    config.delay = (options['--delay'] !== false)
                    ? parseFloat(options['--delay'])
                    : 1;

    checkNumber(config.delay, 'DELAY');

}

if (!config.cycle.every(function(color) { return color in COLORS })) {
    err("Invalid color(s) specified.\n");
    err("Valid colors: " + Object.keys(COLORS).join(', ') + "\n");
    process.exit(1);
}

if (config.mode === 'delay') {

    step = function(state, now) {
        var delta = (now - state.lastColorChange) / 1000;
        if (delta >= config.delay) {
            state.lastColorChange = now;
            state.changeCount++;
        } else if (config.reset) {
            state.lastColorChange = now;
        }
        return state.changeCount;
    }

} else if (config.mode === 'time') {
    
    step = function(state, now) {
        var elapsedSeconds = (now - state.startTime) / 1000;
        return Math.floor(elapsedSeconds / config.period);
    }

} else if (config.mode === 'lines') {

    step = function(state, now) {
        return Math.floor(state.lineNumber / config.lines);
    }

}

var state = {
    startTime       : Date.now(),
    changeCount     : 0,
    lastColorChange : 0,
    lineNumber      : 0
};

new Lazy(process.stdin)
        .lines
        .forEach(function(line) {
            var colorIndex = step(state, Date.now());
            out(colorize(line.toString(), config.cycle[colorIndex % config.cycle.length]));
            out("\n");
            state.lineNumber++;
        });

process.stdin.resume();

function checkNumber(val, name) {
    if (isNaN(val) || val <= 0) {
        err("Invalid argument; " + name + " must be a positive number.\n");
        process.exit(1);
    }
}

function colorize(line, color) {
    return COLORS[color] + line + COLORS.reset;
}