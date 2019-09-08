global.Promise = require('pinkie-promise');
const settings = require('./settings');
const browserify = require('browserify');
const fs = require('fs');
const UglifyJS = require('uglify-js');

new Promise(function (resolve, reject) {
  console.log('Bundling', settings.paths.jsSrc);
  var b = browserify(settings.paths.jsSrc, {
    debug: false
  // noparse: [ 'three' ]
  });
  settings.transforms.forEach(function (t) {
    b.transform(t);
  });
  b.bundle(function (err, src) {
    if (err) return reject(err);
    console.log('Compressing', settings.paths.jsSrc);
    var result = UglifyJS.minify(src.toString());
    console.log('Writing', settings.paths.jsRelDist);
    fs.writeFile(settings.paths.distDir + '/' + settings.paths.jsRelDist, result.code, function (err) {
      if (err) return reject(err);
      resolve();
    });
  });
}).catch(function (err) {
  console.error(err);
}).then(function () {
  console.log('Complete');
});
