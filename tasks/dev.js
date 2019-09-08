const settings = require('./settings');
const budo = require('budo');
const opn = require('opn');
const fs = require('fs');
const simpleHtml = require('simple-html-index');

budo(settings.paths.jsSrc, {
  serve: settings.paths.jsRelDist,
  // host: 'localhost',
  // port: 9966,
  // ssl: true,
  // cors: true,
  live: true,
  dir: settings.paths.distDir,
  stream: process.stdout,
  defaultIndex: function (opt) {
    var html = settings.paths.html;
    if (!fs.existsSync(html)) return simpleHtml(opt);
    return fs.createReadStream(html);
  },
  browserify: {
    transform: settings.transforms
  }
}).on('connect', function (ev) {
  const uri = ev.uri;
  opn(uri);
});
