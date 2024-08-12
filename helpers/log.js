const fs = require('fs');
var util = require('util');

//Terminal colours
Reset = '\x1b[0m';
Bright = '\x1b[1m';
Dim = '\x1b[2m';
Underscore = '\x1b[4m';
Blink = '\x1b[5m';
Reverse = '\x1b[7m';
Hidden = '\x1b[8m';

FgBlack = '\x1b[30m';
FgRed = '\x1b[31m';
FgGreen = '\x1b[32m';
FgYellow = '\x1b[33m';
FgBlue = '\x1b[34m';
FgMagenta = '\x1b[35m';
FgCyan = '\x1b[36m';
FgWhite = '\x1b[37m';

BgBlack = '\x1b[40m';
BgRed = '\x1b[41m';
BgGreen = '\x1b[42m';
BgYellow = '\x1b[43m';
BgBlue = '\x1b[44m';
BgMagenta = '\x1b[45m';
BgCyan = '\x1b[46m';
BgWhite = '\x1b[47m';
reset = '\033[0m';

//set console colour
setColour = function (colour) {
    console.log(colour);
};

//formatted terminal output
log = function (msg, type, colour, bg) {
    if (type == 'folder') {
        colour = this.FgWhite
        bg = this.BgMagenta
        type = '   folder   '
    } else if (type == 'start') {
        colour = this.FgWhite
        bg = this.BgCyan
        type = '  starting  '
    } else if (type == 'ready') {
        colour = this.FgWhite
        bg = this.BgGreen
        type = '  prepared  '
    } else if (type == 'command') {
        colour = this.FgWhite
        bg = this.BgBlack
        type = '   command  '
    } else if (type == 'create') {
        colour = this.FgWhite
        bg = this.BgCyan
        type = '   create   '
    } else if (type == 'load') {
        colour = this.FgWhite
        bg = this.BgMagenta
        type = '    load    '
    } else if (type == 'error') {
        colour = this.FgWhite
        bg = this.BgRed
        type = '   BROKEN   '
    } else if (type == 'warn') {
        colour = this.FgWhite
        bg = this.BgYellow
        type = '    WARN    '
    } else {
        colour = this.FgWhite
        bg = this.BgBlue
        type = '    info    '
    }
    console.log(util.format(colour, bg, type, this.reset, msg));
};
