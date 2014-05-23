var Lazy = require('lazy');

var COLORS = {
    red         : "\x1b[31m",
    green       : "\x1b[32m",
    yellow      : "\x1b[33m",
    blue        : "\x1b[34m",
    magenta     : "\x1b[35m",
    cyan        : "\x1b[36m",
    reset       : "\x1b[0m"
};

var cycle           = ['red', 'green', 'magenta'];
var colorIndex      = -1;
var delay           = 1;
var reset           = true;
var lastColorChange = 0;

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
