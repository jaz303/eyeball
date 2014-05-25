var Lazy = require('lazy');
var fs = require('fs');

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

var cycle           = options['--colors'].split(',').map(function(c) { return c.trim(); });
var delay           = parseFloat(options['--delay']);
var reset           = !options['--no-reset'];
var colorIndex      = -1;
var lastColorChange = 0;

if (!cycle.every(function(color) { return color in COLORS })) {
    process.stderr.write("Invalid color(s) specified.\n");
    process.stderr.write("Valid colors: " + Object.keys(COLORS).join(', ') + "\n");
    process.exit(1);
}

if (isNaN(delay) || delay <= 0) {
    process.stderr.write("Invalid delay; delay must be a positive number.\n");
    process.exit(1);
}

function colorize(line, color) {
    return COLORS[color] + line + COLORS.reset;
}

new Lazy(process.stdin)
        .lines
        .forEach(function(line) {

            var now = Date.now();
            var delta = (now - lastColorChange) / 1000;

            if (delta >= delay) {
                colorIndex = (colorIndex + 1) % cycle.length;
                lastColorChange = now;
            } else if (reset) {
                lastColorChange = now;
            }

            process.stdout.write(colorize(line.toString(), cycle[colorIndex]));
            process.stdout.write("\n");

        });

process.stdin.resume();
