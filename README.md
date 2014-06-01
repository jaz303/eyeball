# eyeball

`eyeball` is a simple utility that color-cycles terminal output based on the elapsed time since the previous line was written. This is useful, for example, when you've got a noisy process that produces a lot of similar looking output, making it hard to determine when activity occurs.

Check out this screenshot of an example session; note that the colour changes whenever `dt` &ge; 1000:

![eyeball Screenshot](https://raw.githubusercontent.com/jaz303/eyeball/master/screenshot.png)

As of version 0.3.0, `eyeball` can also cycle colors every n lines or every n seconds by using the `-l` and `-t` options, respectively. See _Customisation_, below.

## Installation

	$ npm install -g eyeball

## Usage

Default behaviour; change colour whenever time between successive writes is &ge; 1s.

	$ my-process | eyeball

Change colour whenever output is delayed by 5s or more, cycling between red, green and blue:

 	$ my-process | eyeball -d 5 -c red,green,blue

## Customisation

```
Usage: eyeball [options]

Options:
  -d DELAY, --delay=DELAY     Delay mode: cycle color when delay between
                              lines is >= DELAY. This is the default mode;
                              DELAY defaults to 1.
  -l LINES, --lines=LINES     Line mode: cycle color every LINES lines
  -t TIME, --time=TIME        Time mode: cycle color every TIME seconds
  -c COLORS, --colors=COLORS  List of colors to cycle [default: cyan,magenta]
  --no-reset                  Do no reset the timer after each line.
                              (Applies to "Delay" mode only)
  -v, --version               Display program version and quit
  -h, --help                  Display this message and quit
```

### Modes

#### Delay

(This is the default mode)

In Delay mode, output color will cycle based on the time delay between writes; that is, a colour change is triggered whenever the time difference between any two successive lines is &ge; `DELAY`. The default value for `DELAY` is 1 second, overridable via the `-d`/`--delay=` option.

    # color cycle on delay >= 1s
    $ eyeball

    # color cycle on delay >= 5.5s
    $ my-process | eyeball -d 5.5
    $ my-process | eyeball --delay=5.5

When `--no-reset` is specifed, the point of reference is adjusted such that colour change is instead triggered whenever the time since _the previous colour change_ is &ge; DELAY.

#### Lines

In Lines mode, output color will cycle every n lines, as specified by the `-l`/`--lines=` option.

    # color cycle every 3 lines
    $ my-process | eyeball -l 3
    $ my-process | eyeball --lines=3

#### Time

In Time mode, output color will cycle ever n seconds, as specified by the `-t`/`--time=` option.

    # color cycle every 10 seconds
    $ my-process | eyeball -t 10
    $ my-process | eyeball --time=10

### Supported options

  * `-c COLORS`, `--colors=COLORS`: comma-separated list of colours through which to cycle.<br>Supported values: `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `reset`.

## Copyright &amp; License

&copy; 2014 Jason Frame [ [@jaz303](http://twitter.com/jaz303) / [jason@onehackoranother.com](mailto:jason@onehackoranother.com) ]

Released under the ISC license.
