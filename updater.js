console.log('_updater');
const fs = require('fs');
const util = require('util');
const os = require('os');

var log_file = fs.createWriteStream(__dirname + '/updater.log', {flags : 'w'});
var log_stdout = process.stdout;

log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

log('check for payload')
if (fs.existsSync('payload.zip')) {

}